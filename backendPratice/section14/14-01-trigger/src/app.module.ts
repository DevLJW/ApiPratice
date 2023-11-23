import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { BoardsModule } from './APIS/boards/boards.module';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './APIS/products/products.module';
import { ProductsCategoriesModule } from './APIS/productsCategories/productsCategories.module';
import { UsersModule } from './APIS/users/users.module';
import { AuthModule } from './APIS/auth/auth.module';
import { FilesModule } from './APIS/files/files.module';

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
    ],
    // controllers: [AppController],
    // providers: [AppService],
})
export class AppModule {}
