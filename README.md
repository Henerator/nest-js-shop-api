# Nest-JS

https://stepik.org/course/95448/syllabus

## Introduction

Фреймворк для написания сервер-сайд приложений.  
Множество готовых пакетов-модулей.

## Environment setup

### MongoDB

https://studio3t.com/  
в бесплатной версии поддерживает 3 соединения

### NestJS CLI

`npm i -g @nestjs/cli`

#### Commands

`--dry-run` - запуск команды без реальных изменений

- generate
  - `--flat` - без создания вложенной папки
  - `--no-spec` - без создания файлов тестов

## TypeScript

### Array item type

```typescript
const arr = [{ name: 'name', age: 1 }];
type Person = (typeof arr)[number];
```

### Extends generic type

```typescript
type MessageOf<T> = T extends { message: unknown } ? T['message'] : never;
interface StringMessage {
  message: string;
}
interface NumberMessage {
  message: number;
}

type StringMessageContent = MessageOf<StringMessage>;
type NumberMessageContent = MessageOf<NumberMessage>;
```

### Change type key case

```typescript
type Test = {
  a: number;
  b: number;
};

type TestUpper = {
  [key in Uppercase<keyof Test>]: number;
};
```

## Module

Модули разделяются по доменным областям

### Global module

```typescript
@Global()
@Module({
  imports: [...],
  controllers: [...],
  providers: [...],
})
export class ModuleName {}
```

используется без дополнительного импорта.  
глобальный модуль должен быть импортирован в корневой модуль приложения

### Dynamic module

Позволяет передать дополнительные данные при импорте модуля

```typescript
@Module({
  imports: [...],
  controllers: [...],
  providers: [...],
})
export class ModuleName {
  static forRoot(connection: string): DynamicModule {
    const providers = createProviders(connection);
    return {
      module: ModuleName,
      providers: providers,
      exports: providers,
      global: true
    }
  }
}

...

@Module({
  imports: [ModuleName.forRoot('connection')]
})
export class AppModule {}
```

## Controller

Точки взаимодействия с приложением

- HTTP
- MQTT
  > Message Queuing Telemetry Transport.  
  > Протокол обмена сообщениями по шаблону издатель-подписчик
- RabbitMQ
  > распределённый и горизонтально масштабируемый брокер сообщений
- Kafka
  > распределенная потоковая платформа, позволяющая обрабатывать триллионы событий в день
- gRPC
  > система удалённого вызова процедур
- ...

### Global api prefix

```typescript
function bootstrap() {
  app.setGlobalPrefix('api');
}
```

### Arguments decorators

- @Req()
- @Res()
- @Params(key)
- @Body(key)
- @Query(key)
- @Headers(name)
- @Session(name)

### API endpoint settings

```typescript
@HttpCode(204)
@Header('Cache-Control', 'none')
@Rediirect('htps://path', 301)
@Get('item/:id')
endpoint() {}
```

### DTO

Data transfer object - классы описывают тело данных, которые передаются в api методы

## Provders

`@Injectable()` - singleton

`@Injectable({ scope: Scope.Default })` - for scope

`@Injectable({ scope: Scope.Request })` - for request

`@Injectable({ scope: Scope.Transient })` - for inject

## Data base

**MongoDB** - система управления базами данных, которая работает с документоориентированной моделью данных. В отличие от реляционных СУБД, MongoDB не требуются таблицы, схемы или отдельный язык запросов. Информация хранится в виде документов либо коллекций.

### Docker compose

```
version: '3.8'
services:
  mongo:
    image: mongo
    container_name: mongo
    restart: always
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=admin
    ports:
      - 27017:27017
    volumes:
      - ./mongo-data:/data/db
    command: --wiredTigerCacheSizeGB 1.5
```

### Mongoose

Object Document Mapper - объектно-документный отобразитель. Позволяет определять объекты со строго-типизированной схемой, соответствующей документу MongoDB.

### Settings way

- run docker compose up with settings above
- open docker container terminal
- run mongosh

```bash
mongosh --port 27017 -u admin -p  --authenticationDatabase 'admin'
```

- create new database **shop-api**

```bash
use shop-api
```

- create new user

```bash
db.createUser(
   {
     user:"userName",
     pwd: passwordPrompt(),  // or cleartext password
     roles:[ "readWrite" ]
   }
)
```

- update MongooseModule import

```typescript
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://userName:pwd@localhost:27017/shop-api'),
  ],
})
export class AppModule {}
```

## Models

Описывают взаимодействия с json данными, хранящимися в базе данных

- class - структура документа
- document type - данные, возвращаемые из mongo
- schema
- connect schema in module
  `Mongoosemodule.forFeature([{}])`

### Timestamps

Добавляет поля

- createdAt
- updatedAt

```typescript
@Schema({ timestamps: true })
export class NameModel {}
```

## E2E tests

### Jest config

> <font color="#ffcc00">WARNING</font>  
> Nest JS creates wrong `test/jest-e2e.json` file config

To make it work:

- udpate `test/jest-e2e.json file`

  ```json
  {
    "rootDir": "../",
    "modulePaths": ["<rootDir>"]
  }
  ```

- move `*.e2e-spec.ts` into file folder

## Validaation

### Exception filters

модификация ошибок перед отправкой пользователю

```typescript
@Post('create')
@UseFitlers(new TestExceptionFilter())
```

### Pipes

валидация запроса

```typescript
@UsePipes(new TestPipe())
@Post('create')
```

#### Param validation

```typescript
@Delete(':id')
async delete(@Param('id', ParseIntPipe) id: number) {}
```

### Global validation

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilteres([]);
  app.useGlobalPipes([]);
  await app.listen(3000);
}
```

### DTO validation

use `class-validator` and `class-transformer` packages

- add DTO model field vaidators
  ```typescript
  export class CreateReviewDto {
    @IsString()
    name: string;
  }
  ```
- add controller endpoint validation

  ```typescript
  @Controller('review')
  export class ReviewController {
    @UsePipes(new ValidationPipe())
    @Post('create')
    async create(@Body() dto: CreateReviewDto) {
      return this.reviewService.create(dto);
    }
  }
  ```
