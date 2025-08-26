import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseDto } from 'src/configs/responseDto';
import { Artist } from 'src/entities/artist.entity';
import { Repository } from 'typeorm';
import { CreateArtistParams } from './dto/CreateArtist';
import { UpdateArtistParams } from './dto/UpdateArtist';
import { QueryArtistParams } from './dto/QueryArtist';
import * as _ from 'lodash';

@Injectable()
export class ArtistService {
    constructor(
        @InjectRepository(Artist) private repository: Repository<Artist>
    ){}

    async queryArtist(query?: QueryArtistParams) :Promise<ResponseDto> {
        if(!_.isEmpty(query)) {
            const take = query.pageSize;
            const skip = (query.pageSize * query.pageIndex) - query.pageSize;
            const [allRecords, countAllRecords] = await this.repository.findAndCount();
            const [data, total] = await this.repository.findAndCount({relations: {releases: {releaseType: true}}, take, skip});
            if(!data) throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR)
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
            const data = await this.repository.find({relations: {releases: {releaseType: true}}});
            if(!data) throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR)
            return {
                errorCode: 200,
                data,
                message: '',
            }
        }
    }

    async createArtist(artist: CreateArtistParams, imagePath: string): Promise<ResponseDto> {
        const createdArtist = this.repository.create({...artist, image: imagePath});
        const savedArtist = await this.repository.save(createdArtist);
        if(!savedArtist) throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR)
        return {
            errorCode: 200,
            data: savedArtist,
            message: 'Artist created'
        }
    }

    async updateArtist(id: number, updateArtist: UpdateArtistParams, imagePath: string): Promise<ResponseDto> {
        const specArtist = await this.repository.findOneBy({id});
        if(!specArtist) throw new HttpException('Artist not found', HttpStatus.BAD_REQUEST)
        const updatedArtist = await this.repository.update({id}, {...updateArtist, image: imagePath ? imagePath : specArtist.image});
        if(!updatedArtist) throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR)
        return {
            errorCode: 200,
            data: updatedArtist,
            message: 'Artist updated'
        }
    }

    async removeArtist(id: number): Promise<ResponseDto> {
        const specArtist = await this.repository.findOneBy({id});
        if(!specArtist) throw new HttpException('Artist not found', HttpStatus.BAD_REQUEST)
        const removedArtist = this.repository.remove(specArtist);
        return {
            errorCode: 200,
            data: removedArtist,
            message: 'Artist deleted'
        }
    }
}
