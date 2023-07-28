import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './models/user.model';

export interface CreateUserPayload {
  email: string;
  password: string;
}

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  public async createUser(dto: CreateUserDto): Promise<User> {
    const user = new this.userModel(dto);
    return user.save();
  }

  public async getAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  public async getByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }
}
