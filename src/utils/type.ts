import { ApiProperty } from '@nestjs/swagger';

export class CreateArtist {
    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string

    @ApiProperty()
    image: string
}

export class UpdateArtist {
    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string

    @ApiProperty()
    image: string
}

export class CreateRelease {
    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    image: string;

    @ApiProperty()
    artistId: number;

    @ApiProperty()
    releaseTypeId: number;
}

export class UpdateRelease {
    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    image: string;

    @ApiProperty()
    artistId: number;

    @ApiProperty()
    releaseTypeId: number;
}

/* auth */
export class Signin {
    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;
}

export class Signup {
    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;
}

/* song */
export class CreateSong {
    @ApiProperty()
    name: string;

    @ApiProperty()
    image: string;

    @ApiProperty()
    minutes: number;

    @ApiProperty()
    seconds: number;

    @ApiProperty()
    artistId: string;
}

export class UpdateSong {
    @ApiProperty()
    name: string;

    @ApiProperty()
    image: string;

    @ApiProperty()
    minutes: number;

    @ApiProperty()
    seconds: number;
}

export class RequestQuery {
    pageIndex?: number;
    pageSize?: number;
    sortBy?: string;
    sortDir?: string;
    _q?: string;
    isActive?: boolean;
}