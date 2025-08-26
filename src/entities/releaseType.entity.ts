import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('releaseType')
export class ReleaseType {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @CreateDateColumn({ name: 'created_at'})
    created_at: Date | string;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date | string;
}