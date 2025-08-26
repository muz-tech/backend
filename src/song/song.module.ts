import { Module } from '@nestjs/common';
import { SongController } from './song.controller';
import { SongService } from './song.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from 'src/entities/song.entity';
import { Artist } from 'src/entities/artist.entity';

@Module({
  controllers: [SongController],
  providers: [SongService],
  imports: [TypeOrmModule.forFeature([Song, Artist])]
})
export class SongModule {}
