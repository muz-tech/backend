import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Artist } from './artist.entity';

@Entity('song')
export class Song {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column()
    image: string;

    @Column()
    minutes: number;

    @Column()
    seconds: number;

    @Column({ default: 0 })
    views: number;

    @Column()
    url: string;

    @OneToMany(() => Artist, artist => artist.songs)
    artists: Array<Artist>

    @CreateDateColumn({ name: 'created_at'})
    created_at: Date | string;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date | string;
}