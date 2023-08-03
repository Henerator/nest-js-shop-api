import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

export const mongoConfigFactory = async (
  configService: ConfigService,
): Promise<MongooseModuleFactoryOptions> => {
  return {
    uri: configService.get<string>('MONGODB_URI'),
    user: configService.get<string>('MONGODB_USER'),
    pass: configService.get<string>('MONGODB_PASSWORD'),
  };
};
