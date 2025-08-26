import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Artist } from './artist.entity';
import { ReleaseType } from './releaseType.entity';

@Entity('release')
export class Release {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    image: string;

    @ManyToOne(() => Artist, artist => artist.releases)
    artist: Artist;

    @OneToOne(() => ReleaseType)
    @JoinColumn()
    releaseType: ReleaseType

    @CreateDateColumn({ name: 'created_at'})
    created_at: Date | string;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date | string;
}