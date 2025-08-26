import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { SongService } from './song.service';
import { songFileConf } from 'src/configs/fileUpload';
import { CreateSong, RequestQuery, UpdateSong } from 'src/utils/type';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('song')
export class SongController {
    constructor(
        private songService: SongService
    ){}

    @Get()
    findSongs(@Query() query: RequestQuery) {
        return this.songService.findSongs(query);
    }

    @Get(':id')
    findSpecified(@Param('id', ParseIntPipe) id: number) {
        return this.songService.findSpecified(id)
    }

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'image', maxCount: 1},
        {name: 'file', maxCount: 1}
    ], songFileConf))
    createSong(@Body() createSong: CreateSong, @UploadedFiles() files: { image: Express.Multer.File, file: Express.Multer.File}) {
        return this.songService.createSong(createSong, files.image[0].path, files.file[0].path);
    }

    @Post(':id')
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'image', maxCount: 1},
        {name: 'file', maxCount: 1}
    ], songFileConf))
    updateSong(@Param('id', ParseIntPipe) id: number, @Body() updateSong: UpdateSong, @UploadedFiles() files: { image: Express.Multer.File, file: Express.Multer.File}) {
        return this.songService.updateSong(id, updateSong, files.image[0].path, files.file[0].path);
    }

    @Delete(':id')
    removeSong(@Param('id', ParseIntPipe) id: number) {
        return this.songService.removeSong(id);
    }
}
