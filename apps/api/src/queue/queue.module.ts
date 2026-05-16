import { Global, Module } from '@nestjs/common';
import { Queue } from 'bullmq';
import Redis from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CONNECTION',
      useFactory: () => new Redis(process.env.REDIS_URL ?? ''),
    },
    {
      provide: 'BILLING_QUEUE',
      inject: ['REDIS_CONNECTION'],
      useFactory: (connection: Redis) => new Queue('billing', { connection }),
    },
  ],
  exports: ['REDIS_CONNECTION', 'BILLING_QUEUE'],
})
export class QueueModule {}
