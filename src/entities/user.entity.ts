import { IsPremium } from 'src/configs/constants';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Role } from './role.entity';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: IsPremium,
        default: IsPremium.FALSE
    })
    is_premium: IsPremium;

    @OneToMany(() => Role, role => role.user)
    roles: Array<Role>

    @CreateDateColumn({ name: 'created_at'})
    created_at: Date | string;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date | string;
}