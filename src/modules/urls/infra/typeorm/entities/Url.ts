/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line no-shadow

import Employee from '@modules/employee/infra/typeorm/entities/Employee';
import { Length } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('urls')
export default class Url {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @JoinColumn({ name: 'id_employee' })
  @ManyToOne(() => Employee, (user) => user.id)
  employee: Employee;

  @Column({ length: 100 })
  @Length(1, 100, {
    message: 'O originalUrl deve ter no minimo 1 caracteres.',
  })
  originalUrl: string;

  @Column()
  shortUrl: string;

  @Column()
  clicks: number;

  @Column()
  id_employee: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
