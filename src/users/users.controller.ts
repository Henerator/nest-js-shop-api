import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserPayload, UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async create(@Body() dto: CreateUserPayload) {
    this.usersService.createUser(dto);
  }

  @Get()
  async get() {
    const allUsers = this.usersService.getAll();
    return allUsers;
  }
}
