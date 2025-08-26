import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ReleaseService } from './release.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { releaseImageConf } from 'src/configs/fileUpload';
import { CreateRelease, RequestQuery, UpdateRelease } from 'src/utils/type';

@Controller('release')
export class ReleaseController {
    constructor(
        private releaseService: ReleaseService
    ){}

    @Get()
    findAll(@Query() query?: RequestQuery) {
        return this.releaseService.findAll(query);
    }

    @Get('/types')
    getReleaseTypes() {
        return this.releaseService.getReleaseTypes();
    }

    @Post()
    @UseInterceptors(FileInterceptor('image', releaseImageConf))
    createRelease(@Body() createRelease: CreateRelease, @UploadedFile() image: Express.Multer.File) {
        return this.releaseService.createRelease(createRelease, image.path);
    }

    @Post(':id')
    @UseInterceptors(FileInterceptor('image', releaseImageConf))
    updateRelease(@Param('id', ParseIntPipe) id: number, @Body() updateRelease: UpdateRelease, @UploadedFile() image: Express.Multer.File) {
        return this.releaseService.updateRelease(id, updateRelease, image.path);
    }
}
