import { Injectable, Logger } from '@nestjs/common';
import { Worker, Job } from 'bullmq';
import { NotificationsService } from './notifications.service';

@Injectable()
export class NotificationsProcessor {
  private readonly logger = new Logger(NotificationsProcessor.name);
  private worker: Worker;

  constructor(private readonly notificationsService: NotificationsService) {}

  onModuleInit() {
    const redisUrl = process.env.REDIS_URL;
    const connectionConfig = redisUrl
      ? {
          host: new URL(redisUrl).hostname,
          port: parseInt(new URL(redisUrl).port || '6379'),
          username: new URL(redisUrl).username || undefined,
          password: new URL(redisUrl).password || undefined,
          tls: redisUrl.startsWith('rediss://') ? {} : undefined,
        }
      : { host: process.env.REDIS_HOST ?? 'localhost', port: parseInt(process.env.REDIS_PORT ?? '6379') };

    this.worker = new Worker('notifications', async (job: Job) => this.processJob(job), { connection: connectionConfig });
    this.worker.on('failed', (job, err) => this.logger.error(`Job ${job?.id} failed: ${err.message}`));
  }

  onModuleDestroy() {
    void this.worker?.close();
  }

  private async processJob(job: Job): Promise<void> {
    try {
      const { name, data } = job;
      this.logger.log(`Processing notification job: ${name}`);

      switch (name) {
        case 'payment-submitted':
          await this.notificationsService.createNotification(
            data.landlordId,
            'New Payment Submitted',
            `${data.tenantName} submitted a payment for bill #${data.billId}`,
            'payment-submitted',
            data,
          );
          break;
        case 'payment-approved':
          await this.notificationsService.createNotification(
            data.tenantId,
            'Payment Approved',
            'Your payment has been approved.',
            'payment-approved',
            data,
          );
          break;
        case 'payment-rejected':
          await this.notificationsService.createNotification(
            data.tenantId,
            'Payment Rejected',
            `Your payment was rejected: ${data.reason ?? 'No reason provided.'}`,
            'payment-rejected',
            data,
          );
          break;
        case 'appliance-approved':
          await this.notificationsService.createNotification(
            data.tenantId,
            'Appliance Approved',
            `Your appliance "${data.applianceName}" has been approved.`,
            'appliance-approved',
            data,
          );
          break;
        case 'appliance-rejected':
          await this.notificationsService.createNotification(
            data.tenantId,
            'Appliance Rejected',
            `Your appliance "${data.applianceName}" was rejected.`,
            'appliance-rejected',
            data,
          );
          break;
        case 'auto-overdue':
          await this.notificationsService.createNotification(
            data.tenantId,
            'Bill Overdue',
            `Your bill of ₱${data.amount} is now overdue.`,
            'auto-overdue',
            data,
          );
          break;
        case 'bill-reminder':
          await this.notificationsService.createNotification(
            data.tenantId,
            'Bill Due Soon',
            `Your bill of ₱${data.amount} is due on ${data.dueDate}.`,
            'bill-reminder',
            data,
          );
          break;
        default:
          this.logger.warn(`Unknown job type: ${name}`);
      }
    } catch (err) {
      this.logger.error(`Failed to process notification job ${job.id}: ${(err as Error).message}`);
    }
  }
}
