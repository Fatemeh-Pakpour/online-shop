import { join } from 'node:path';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule, Query, Resolver } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';

import { envValidationSchema } from './config/env.validation';

const isProduction = process.env.NODE_ENV === 'production';

@Resolver()
class AdminStatusResolver {
  @Query(() => String)
  adminStatus(): string {
    return 'admin-api-ok';
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: envValidationSchema,
      validationOptions: { abortEarly: false },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      path: '/graphql',
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: false,
      introspection: !isProduction,
      plugins: isProduction ? [] : [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('MONGODB_URI'),
      }),
    }),
  ],
  providers: [AdminStatusResolver],
})
export class AppModule {}
