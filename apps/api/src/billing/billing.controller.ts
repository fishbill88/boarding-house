import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, AuthUserPayload } from '../common/decorators/current-user.decorator';
import { BillingService } from './billing.service';
import { GenerateBillsDto } from './dto/generate-bills.dto';

@UseGuards(JwtAuthGuard)
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('generate')
  generate(@CurrentUser() user: AuthUserPayload, @Body() dto: GenerateBillsDto) {
    return this.billingService.generateBills(user.sub, user.role, dto);
  }

  @Get('bills')
  listBills(
    @CurrentUser() user: AuthUserPayload,
    @Query('tenantId') tenantId?: string,
    @Query('status') status?: string,
    @Query('billingMonth') billingMonth?: string,
    @Query('billingYear') billingYear?: string,
    @Query('type') type?: string,
  ) {
    return this.billingService.listBills(user.sub, user.role, {
      tenantId,
      status,
      billingMonth: billingMonth ? parseInt(billingMonth) : undefined,
      billingYear: billingYear ? parseInt(billingYear) : undefined,
      type,
    });
  }

  @Get('bills/me')
  listMyBills(
    @CurrentUser() user: AuthUserPayload,
    @Query('status') status?: string,
    @Query('billingMonth') billingMonth?: string,
    @Query('billingYear') billingYear?: string,
  ) {
    return this.billingService.listMyBills(user.sub, {
      status,
      billingMonth: billingMonth ? parseInt(billingMonth) : undefined,
      billingYear: billingYear ? parseInt(billingYear) : undefined,
    });
  }

  @Get('summary')
  getSummary(
    @CurrentUser() user: AuthUserPayload,
    @Query('billingMonth') billingMonth: string,
    @Query('billingYear') billingYear: string,
  ) {
    return this.billingService.getSummary(user.sub, user.role, parseInt(billingMonth), parseInt(billingYear));
  }

  @Get('summary/me')
  getMySummary(@CurrentUser() user: AuthUserPayload) {
    return this.billingService.getMySummary(user.sub);
  }

  @Get('bills/:id')
  getBill(@Param('id') id: string, @CurrentUser() user: AuthUserPayload) {
    return this.billingService.getBill(id, user.sub, user.role);
  }

  @Patch('bills/:id/mark-overdue')
  markOverdue(@Param('id') id: string, @CurrentUser() user: AuthUserPayload) {
    return this.billingService.markOverdue(id, user.sub, user.role);
  }

  @Delete('bills/:id')
  deleteBill(@Param('id') id: string, @CurrentUser() user: AuthUserPayload) {
    return this.billingService.deleteBill(id, user.sub, user.role);
  }
}
