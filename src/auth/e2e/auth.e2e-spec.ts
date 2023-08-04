import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { disconnect } from 'mongoose';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';
import { AuthDto } from '../dto/auth.dto';

const authDto: AuthDto = {
  email: 'test@test.com',
  password: 'test',
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(authDto)
      .expect(200)
      .then((response) => {
        expect(response.body.access_token).toBeDefined();
      });
  });

  it('/auth/login (POST) - wrong password', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...authDto, password: 'wrongpassword' })
      .expect(401, {
        message: 'Wrong password',
        error: 'Unauthorized',
        statusCode: 401,
      });
  });

  it('/auth/login (POST) - wrong email', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...authDto, email: 'wrongemail' })
      .expect(401, {
        message: 'User with this email not found',
        error: 'Unauthorized',
        statusCode: 401,
      });
  });

  afterAll(() => {
    disconnect();
  });
});
