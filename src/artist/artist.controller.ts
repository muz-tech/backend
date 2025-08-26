import { Controller, Get, Post, Body, Param, ParseIntPipe, Delete, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { RequestQuery, CreateArtist, UpdateArtist } from 'src/utils/type';
import { FileInterceptor } from '@nestjs/platform-express';
import { artistImageConf } from 'src/configs/fileUpload';

@Controller('artist')
export class ArtistController {
    constructor(
        private artistService: ArtistService
    ){}

    @Get()
    queryArtist(@Query() query?: RequestQuery) {
        return this.artistService.queryArtist(query);
    }

    @Post()
    @UseInterceptors(FileInterceptor('image', artistImageConf))
    createArtist(@Body() artist: CreateArtist, @UploadedFile() image: Express.Multer.File) {
        return this.artistService.createArtist(artist, image.path);
    }

    @Post(':id')
    @UseInterceptors(FileInterceptor('image', artistImageConf))
    updateArtist(@Param('id', ParseIntPipe) id: number, @Body() updateArtist: UpdateArtist, @UploadedFile() image?: Express.Multer.File) {
        return this.artistService.updateArtist(id, updateArtist, image ? image.path : null);
    }

    @Delete(':id')
    removeArtist(@Param('id', ParseIntPipe) id: number) {
        return this.artistService.removeArtist(id);
    }
}
