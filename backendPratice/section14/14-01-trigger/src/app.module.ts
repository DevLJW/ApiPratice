import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { BoardsModule } from './APIS/boards/boards.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './APIS/products/products.module';
import { ProductsCategoriesModule } from './APIS/productsCategories/productsCategories.module';
import { UsersModule } from './APIS/users/users.module';
import { AuthModule } from './APIS/auth/auth.module';
import { FilesModule } from './APIS/files/files.module';
import { CACHE_MANAGER, CacheModule, CacheStore } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';

import { redisStore } from 'cache-manager-redis-store';
ConfigModule;

//  합치는 용도
@Module({
    imports: [
        BoardsModule,
        FilesModule,
        ProductsModule,
        ProductsCategoriesModule,
        UsersModule,
        AuthModule,
        ConfigModule.forRoot(),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: 'src/commons/graphql/schema.gql',
            context: ({ req, res }) => {
                //  req는 기본적으로 들어오지만, res는 이걸 작성해야만 들어온다.
                return {
                    req,
                    res,
                };
            },
        }),
        TypeOrmModule.forRoot({
            type: process.env.DATABASE_TYPE as 'mysql',
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_DATABASE,
            entities: [__dirname + '/APIS/**/*.entity.*'], //  실제 실행은 dist폴더에 js로 바뀐다. 그래서 .*로바꿔준다.
            synchronize: true,
            logging: true,
        }),

        //  redis 4버전을 지원하지 않아 최신 redis 3.x.x의 릴리스를 설치해야 한다.

        CacheModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],

            isGlobal: true,
            useFactory: async (config: ConfigService) => {
                const store = await redisStore({
                    url: config.get('127.0.0.1:6379'),
                });
                return {
                    store: store as unknown as CacheStore,
                };
            },
        }),
    ],
    // controllers: [AppController],
    // providers: [AppService],
})
export class AppModule {}
