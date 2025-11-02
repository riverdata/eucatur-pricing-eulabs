import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  AfterUpdate
} from "typeorm";

@Entity()
export class Line {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  description: string;

  @Column({ unique: true })
  line_id: number;

  @Column({ unique: true })
  line_code: string;

  @Column()
  line_description: string;

  @Column({ nullable: true })
  company_code: string;

  @Column({ nullable: true })
  company_name: string;

  @Column({ nullable: true })
  line_status: string;

  @Column({ default: "0" })
  line_total_km: string;

  @Column('jsonb', { default: [] })
  line_class: string[];

  @Column({ default: 0 })
  line_total_routes: number;

  
  @Column({ default: 0 })
  line_total_services: number;

  @Column({ type: 'smallint', default: 0 })
  line_backup: number;

  @Column({ type: 'smallint', default: 0 })
  line_tb_precificacao: number;

  @Column({ type: 'smallint', default: 0 })
  line_lambdas: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @AfterUpdate()
  protected setUpdatedAt(): void {
    this.updatedAt = new Date();
  }
}