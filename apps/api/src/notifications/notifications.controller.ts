import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, AuthUserPayload } from '../common/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  list(@CurrentUser() user: AuthUserPayload, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.notificationsService.listForUser(user.sub, page ? parseInt(page) : 1, limit ? parseInt(limit) : 20);
  }

  @Get('unread-count')
  unreadCount(@CurrentUser() user: AuthUserPayload) {
    return this.notificationsService.unreadCount(user.sub);
  }

  @Patch('read-all')
  markAllRead(@CurrentUser() user: AuthUserPayload) {
    return this.notificationsService.markAllRead(user.sub);
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string, @CurrentUser() user: AuthUserPayload) {
    return this.notificationsService.markRead(id, user.sub);
  }
}
