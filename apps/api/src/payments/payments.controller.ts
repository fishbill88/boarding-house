import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, AuthUserPayload } from '../common/decorators/current-user.decorator';
import { PaymentsService } from './payments.service';
import { SubmitPaymentDto } from './dto/submit-payment.dto';
import { RejectPaymentDto } from './dto/reject-payment.dto';
import { LandlordRecordDto } from './dto/landlord-record.dto';

@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  submit(@CurrentUser() user: AuthUserPayload, @Body() dto: SubmitPaymentDto) {
    return this.paymentsService.submitPayment(user.sub, dto);
  }

  @Get()
  list(
    @CurrentUser() user: AuthUserPayload,
    @Query('status') status?: string,
    @Query('tenantId') tenantId?: string,
    @Query('billId') billId?: string,
  ) {
    return this.paymentsService.listPayments(user.sub, user.role, { status, tenantId, billId });
  }

  @Get('me')
  listMine(@CurrentUser() user: AuthUserPayload) {
    return this.paymentsService.listMyPayments(user.sub);
  }

  @Post('landlord-record')
  landlordRecord(@CurrentUser() user: AuthUserPayload, @Body() dto: LandlordRecordDto) {
    return this.paymentsService.landlordRecord(user.sub, user.role, dto);
  }

  @Get(':id')
  get(@Param('id') id: string, @CurrentUser() user: AuthUserPayload) {
    return this.paymentsService.getPayment(id, user.sub, user.role);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string, @CurrentUser() user: AuthUserPayload) {
    return this.paymentsService.approvePayment(id, user.sub, user.role);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string, @CurrentUser() user: AuthUserPayload, @Body() dto: RejectPaymentDto) {
    return this.paymentsService.rejectPayment(id, user.sub, user.role, dto);
  }
}
