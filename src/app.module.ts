import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistModule } from './artist/artist.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReleaseModule } from './release/release.module';
import { AuthModule } from './auth/auth.module';
import { SongModule } from './song/song.module';
import 'dotenv/config'

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    username: process.env.USERNAME_DATABASE,
    password: process.env.PASSWORD_DATABASE,
    database: process.env.DATABASE_NAME,
    autoLoadEntities: true,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  }),ArtistModule, ReleaseModule, AuthModule, SongModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
