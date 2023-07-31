import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateReviewDto } from 'src/review/dto/create-review.dto';
import { REVIEW_NOT_FOUND } from 'src/review/errors.const';
import { disconnect, Types } from 'mongoose';
import { AppModule } from 'src/app.module';
import * as request from 'supertest';

const productId = new Types.ObjectId(1).toHexString();

const reviewDto: CreateReviewDto = {
  name: 'name',
  title: 'title',
  description: 'description',
  rating: 5,
  productId,
};

describe('ReviewController (e2e)', () => {
  let app: INestApplication;
  let createdReviewId = '';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/review/create (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send(reviewDto)
      .expect(201)
      .then((response) => {
        createdReviewId = response.body._id;
        expect(createdReviewId).toBeDefined();
      });
  });

  it('/review/byProduct/:productId (GET) - success', () => {
    return request(app.getHttpServer())
      .get(`/review/byProduct/${productId}`)
      .expect(200)
      .then((response) => {
        expect(response.body.length).toBe(1);
      });
  });

  it('/review/byProduct/:productId (GET) - fail', () => {
    const fakeId = new Types.ObjectId(1).toHexString();
    return request(app.getHttpServer())
      .get(`/review/byProduct/${fakeId}`)
      .expect(200)
      .then((response) => {
        expect(response.body.length).toBe(0);
      });
  });

  it('/review/:id (DELETE) - success', () => {
    return request(app.getHttpServer())
      .delete(`/review/${createdReviewId}`)
      .expect(200);
  });

  it('/review/:id (DELETE) - fail', () => {
    const fakeId = new Types.ObjectId(1).toHexString();
    return request(app.getHttpServer())
      .delete(`/review/${fakeId}`)
      .expect(404, { statusCode: 404, message: REVIEW_NOT_FOUND });
  });

  afterAll(() => {
    disconnect();
  });
});
