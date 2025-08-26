import { Module } from '@nestjs/common';
import { ReleaseController } from './release.controller';
import { ReleaseService } from './release.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Release } from 'src/entities/release.entity';
import { ReleaseType } from 'src/entities/releaseType.entity';
import { Artist } from 'src/entities/artist.entity';

@Module({
  controllers: [ReleaseController],
  providers: [ReleaseService],
  imports: [TypeOrmModule.forFeature([Release, ReleaseType, Artist])]
})
export class ReleaseModule {}
