import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { EMAIL_IN_USE } from './errors.const';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: AuthDto) {
    const user = await this.service.findUser(dto.email);

    if (user) {
      throw new BadRequestException(EMAIL_IN_USE);
    }

    return this.service.createUser(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto) {
    const email = await this.service.validateUser(dto);
    return this.service.loginUser(email);
  }

  @Get('users')
  async get() {
    return this.service.getAllUsers();
  }
}
