import { Module } from '@nestjs/common';
import { AppliancesController } from './appliances.controller';
import { AppliancesService } from './appliances.service';

@Module({
  controllers: [AppliancesController],
  providers: [AppliancesService],
})
export class AppliancesModule {}
