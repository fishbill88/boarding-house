import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, AuthUserPayload } from '../common/decorators/current-user.decorator';
import { TenantsService } from './tenants.service';
import { ApproveTenantDto } from './dto/approve-tenant.dto';
import { RejectTenantDto } from './dto/reject-tenant.dto';
import { IdUploadDto } from './dto/id-upload.dto';

@UseGuards(JwtAuthGuard)
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  list(@CurrentUser() user: AuthUserPayload) {
    return this.tenantsService.list(user.sub, user.role as never);
  }

  @Get('pending')
  pending(@CurrentUser() user: AuthUserPayload) {
    return this.tenantsService.pending(user.sub, user.role as never);
  }

  @Get(':id')
  detail(@Param('id') id: string, @CurrentUser() user: AuthUserPayload) {
    return this.tenantsService.detail(id, user.sub, user.role as never);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string, @Body() dto: ApproveTenantDto, @CurrentUser() user: AuthUserPayload) {
    return this.tenantsService.approve(id, user.sub, user.role as never, dto);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string, @Body() dto: RejectTenantDto, @CurrentUser() user: AuthUserPayload) {
    return this.tenantsService.reject(id, user.sub, user.role as never, dto);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string, @CurrentUser() user: AuthUserPayload) {
    return this.tenantsService.deactivate(id, user.sub, user.role as never);
  }

  @Post('me/id-upload')
  uploadId(@CurrentUser() user: AuthUserPayload, @Body() dto: IdUploadDto) {
    return this.tenantsService.uploadId(user.sub, user.role as never, dto.contentType);
  }
}
