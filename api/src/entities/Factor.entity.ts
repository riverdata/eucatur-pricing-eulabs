import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  AfterUpdate
} from "typeorm";

@Entity()
export class Factor {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  description: string;

  @Column()
  factor_code: string;

  @Column({ unique: true })
  factor_description: string;
  
  @Column()
  factor_weight: number;

  @Column('jsonb', { default: [] })
  factor_weight_add: object[];

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

export type FactorRequestData = {
  description: string;
  factor_code: string;
  factor_description: string;
  factor_weight_add: object[];
};
