import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('role')
export class Role {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    key: string;

    @Column()
    name: string;

    @ManyToOne(() => User, user => user.roles)
    user: User

    @CreateDateColumn({ name: 'created_at'})
    created_at: Date | string;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date | string;
}