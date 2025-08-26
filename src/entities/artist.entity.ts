import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Release } from './release.entity';
import { Song } from './song.entity';

@Entity('artist')
export class Artist {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    image: string;

    @Column({ default: 0 })
    listener: number;

    @OneToMany(() => Release, release => release.artist )
    releases: Array<Release>

    @ManyToOne(() => Song, song => song.artists)
    songs: Array<Song>

    @CreateDateColumn({ name: 'created_at'})
    created_at: Date | string;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date | string;
}