import { Controller, Get, Param, Put } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth/key')
export class AuthController {
  constructor(private readonly appService: AuthService) {}

  @Get()
  getApiKey() {
    return this.appService.generateKey();
  }

  @Put(':keyId')
  revokeApiKey(@Param('keyId') keyId: string) {
    return this.appService.revokeKey(keyId);
  }
}
