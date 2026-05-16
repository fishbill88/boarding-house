import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, AuthUserPayload } from '../common/decorators/current-user.decorator';
import { AppliancesService } from './appliances.service';
import { RegisterApplianceDto } from './dto/register-appliance.dto';
import { ApproveApplianceDto } from './dto/approve-appliance.dto';

@UseGuards(JwtAuthGuard)
@Controller('appliances')
export class AppliancesController {
  constructor(private readonly appliancesService: AppliancesService) {}

  @Post()
  register(@CurrentUser() user: AuthUserPayload, @Body() dto: RegisterApplianceDto) {
    return this.appliancesService.register(user.sub, user.role, dto);
  }

  @Get('me')
  listMine(@CurrentUser() user: AuthUserPayload) {
    return this.appliancesService.listMine(user.sub);
  }

  @Get()
  listAll(@CurrentUser() user: AuthUserPayload, @Query('status') status?: string, @Query('tenantId') tenantId?: string) {
    return this.appliancesService.listAll(user.sub, user.role, { status, tenantId });
  }

  @Get(':id')
  get(@Param('id') id: string, @CurrentUser() user: AuthUserPayload) {
    return this.appliancesService.get(id, user.sub, user.role);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string, @CurrentUser() user: AuthUserPayload, @Body() dto: ApproveApplianceDto) {
    return this.appliancesService.approve(id, user.sub, user.role, dto);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string, @CurrentUser() user: AuthUserPayload) {
    return this.appliancesService.reject(id, user.sub, user.role);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser() user: AuthUserPayload) {
    return this.appliancesService.delete(id, user.sub, user.role);
  }
}
