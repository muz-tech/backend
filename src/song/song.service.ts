import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from 'src/entities/song.entity';
import { In, Repository } from 'typeorm';
import { CreateSong } from './dto/CreateSong';
import { ResponseDto } from 'src/configs/responseDto';
import { UpdateSong } from './dto/UpdateSong';
import { Artist } from 'src/entities/artist.entity';
import { SongQueryParams } from './dto/SongQuery';
import * as _ from 'lodash';

@Injectable()
export class SongService {
    constructor(
        @InjectRepository(Song) private repository: Repository<Song>,
        @InjectRepository(Artist) private artistRepository: Repository<Artist>
    ) { }

    async findSongs(query: SongQueryParams): Promise<ResponseDto> {
        if (!_.isEmpty(query)) {
            const take = query.pageSize;
            const skip = (query.pageSize * query.pageIndex) - query.pageSize;
            const [allRecords, countAllRecords] = await this.repository.findAndCount();
            const [data, total] = await this.repository.findAndCount({ relations: { artists: true }, take, skip });
            if (!data) throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR)
            return {
                errorCode: 200,
                data,
                message: '',
                meta: {
                    total,
                    currentPage: query.pageIndex,
                    size: take,
                    hasNextPage: query.pageIndex >= countAllRecords ? false : true,
                    hasPrevPage: query.pageIndex <= 1 ? false : true,
                    totalPage: countAllRecords / total
                }
            }
        } else {
            const songs = await this.repository.find({ relations: { artists: true } });
            if (!songs) throw new HttpException('Error', HttpStatus.BAD_REQUEST);
            return {
                errorCode: 200,
                data: songs,
                message: 'Found'
            }
        }
    }

    async findSpecified(id: number): Promise<ResponseDto> {
        const specSong = await this.repository.findOneBy({ id });
        if (!specSong) throw new HttpException('Error', HttpStatus.BAD_REQUEST);
        const views = specSong.views;
        const incrViews = await this.repository.update({ id }, { ...specSong, views: views + 1 })
        return {
            errorCode: 200,
            data: incrViews,
            message: 'Found'
        }
    }

    async createSong(createSong: CreateSong, imagePath: string, url: string): Promise<ResponseDto> {
        const specArtist = await this.artistRepository.findBy({ id: In(JSON.parse(createSong.artistId)) })
        const createdSong = this.repository.create({ ...createSong, image: imagePath, artists: specArtist, url });
        const savedSong = await this.repository.save(createdSong);
        if (!savedSong) throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR)
        return {
            errorCode: 200,
            data: savedSong,
            message: 'Song created'
        }
    }

    async updateSong(id: number, updateSong: UpdateSong, imagePath: string, url: string): Promise<ResponseDto> {
        const specSong = await this.repository.findOneBy({ id });
        if (!specSong) throw new HttpException('Error', HttpStatus.BAD_REQUEST);
        const updatedSong = await this.repository.update({ id }, { ...updateSong, image: imagePath });
        if (!updateSong) throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
        return {
            errorCode: 200,
            data: updatedSong,
            message: 'Song updated'
        }
    }

    async removeSong(id: number): Promise<ResponseDto> {
        const specSong = await this.repository.findOneBy({ id });
        if (!specSong) throw new HttpException('Error', HttpStatus.BAD_REQUEST);
        const removedSong = await this.repository.remove(specSong);
        if (!removedSong) throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
        return {
            errorCode: 200,
            data: removedSong,
            message: 'Song removed'
        }
    }
}
