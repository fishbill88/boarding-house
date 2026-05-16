import { Module } from '@nestjs/common';
import { QueueModule } from '../queue/queue.module';
import { AppliancesController } from './appliances.controller';
import { AppliancesService } from './appliances.service';

@Module({
  imports: [QueueModule],
  controllers: [AppliancesController],
  providers: [AppliancesService],
})
export class AppliancesModule {}
