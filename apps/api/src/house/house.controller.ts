import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { HouseService } from './house.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, AuthUserPayload } from '../common/decorators/current-user.decorator';
import { UpdateHouseDto } from './dto/update-house.dto';
import { UpdateHouseSettingsDto } from './dto/update-house-settings.dto';

@UseGuards(JwtAuthGuard)
@Controller('house')
export class HouseController {
  constructor(private readonly houseService: HouseService) {}

  @Get()
  getHouse(@CurrentUser() user: AuthUserPayload) {
    return this.houseService.getHouse(user.sub, user.role as never);
  }

  @Patch()
  updateHouse(@CurrentUser() user: AuthUserPayload, @Body() dto: UpdateHouseDto) {
    return this.houseService.updateHouse(user.sub, user.role as never, dto);
  }

  @Get('settings')
  getSettings(@CurrentUser() user: AuthUserPayload) {
    return this.houseService.getSettings(user.sub, user.role as never);
  }

  @Patch('settings')
  updateSettings(@CurrentUser() user: AuthUserPayload, @Body() dto: UpdateHouseSettingsDto) {
    return this.houseService.updateSettings(user.sub, user.role as never, dto);
  }

  @Get('code')
  getCode(@CurrentUser() user: AuthUserPayload) {
    return this.houseService.getCode(user.sub, user.role as never);
  }

  @Post('code/regenerate')
  regenerateCode(@CurrentUser() user: AuthUserPayload) {
    return this.houseService.regenerateCode(user.sub, user.role as never);
  }
}
