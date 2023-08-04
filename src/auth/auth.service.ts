import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compare, genSalt, hash } from 'bcryptjs';
import { Model } from 'mongoose';
import { AuthDto } from './dto/auth.dto';
import { USER_NOT_FOUND, WRONG_PASSWORD } from './errors.const';
import { User, UserDocument } from './models/user.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(dto: AuthDto) {
    const salt = await genSalt(10);
    const passwordHash = await hash(dto.password, salt);
    const user = new this.userModel({
      email: dto.email,
      passwordHash,
    });

    return user.save();
  }

  async validateUser(dto: AuthDto) {
    const user = await this.findUser(dto.email);

    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND);
    }

    const isCorrectPass = await compare(dto.password, user.passwordHash);
    if (!isCorrectPass) {
      throw new UnauthorizedException(WRONG_PASSWORD);
    }

    return user.email;
  }

  async loginUser(email: string) {
    const payload = { email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async findUser(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
