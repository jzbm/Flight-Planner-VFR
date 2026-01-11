import { Controller, Get, Post, Patch, Delete, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user basic info' })
  async getMe(@Request() req) {
    return this.usersService.findById(req.user.userId);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile with stats' })
  async getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfile(@Request() req, @Body() body: { name?: string }) {
    return this.usersService.updateProfile(req.user.userId, body);
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Change user password' })
  async changePassword(
    @Request() req,
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    return this.usersService.changePassword(
      req.user.userId,
      body.currentPassword,
      body.newPassword,
    );
  }

  @Delete('account')
  @ApiOperation({ summary: 'Delete user account' })
  async deleteAccount(@Request() req) {
    return this.usersService.deleteAccount(req.user.userId);
  }
}
