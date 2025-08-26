import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseDto } from 'src/configs/responseDto';
import { Release } from 'src/entities/release.entity';
import { Repository } from 'typeorm';
import { CreateReleaseParams } from './dto/CreateRelease';
import { UpdateReleaseParams } from './dto/UpdateRelease';
import { ReleaseType } from 'src/entities/releaseType.entity';
import { ReleaseQueryParams } from './dto/ReleaseQuery';
import * as _ from 'lodash';
import { Artist } from 'src/entities/artist.entity';

@Injectable()
export class ReleaseService {
    constructor(
        @InjectRepository(Release) private repository: Repository<Release>,
        @InjectRepository(ReleaseType) private typeRepository: Repository<ReleaseType>,
        @InjectRepository(Artist) private artistRepository: Repository<Artist>
    ) { }

    async findAll(query?: ReleaseQueryParams): Promise<ResponseDto> {
        if (!_.isEmpty(query)) {
            const take = query.pageSize;
            const skip = (query.pageSize * query.pageIndex) - query.pageSize;
            const [allRecords, countAllRecords] = await this.repository.findAndCount();
            const [data, total] = await this.repository.findAndCount({ relations: { artist: true, releaseType: true }, take, skip });
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
            const releases = await this.repository.find({ relations: { artist: true, releaseType: true } });
            if (!releases) throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR)
            return {
                errorCode: 200,
                data: releases,
                message: ''
            }
        }
    }

    async getReleaseTypes(): Promise<ResponseDto> {
        const releaseTypes = await this.typeRepository.find();
        if (!releaseTypes) throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
        return {
            errorCode: 200,
            data: releaseTypes,
            message: ''
        }
    }

    async createRelease(release: CreateReleaseParams, imagePath: string): Promise<ResponseDto> {
        const specArtist = await this.artistRepository.findOneBy({ id: release.artistId });
        const specReleaseType = await this.typeRepository.findOneBy({ id: release.releaseTypeId });
        const createdRelease = this.repository.create({ name: release.name, description: release.description, image: imagePath, artist: specArtist, releaseType: specReleaseType });
        const savedRelease = await this.repository.save(createdRelease);
        if (!savedRelease) throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR)
        return {
            errorCode: 200,
            data: savedRelease,
            message: 'Release created'
        }
    }

    async updateRelease(id: number, updateRelease: UpdateReleaseParams, imagePath: string): Promise<ResponseDto> {
        const specRelease = await this.repository.findOneBy({ id });
        if (!specRelease) throw new HttpException('Release not found', HttpStatus.BAD_REQUEST)
        const updatedRelease = await this.repository.update({ id }, { ...updateRelease, image: imagePath })
        if (!updatedRelease) throw new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR)
        return {
            errorCode: 200,
            data: updatedRelease,
            message: 'Release updated'
        }
    }
}
