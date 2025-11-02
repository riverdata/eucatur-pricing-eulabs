import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  AfterUpdate,
  ManyToOne,
  JoinColumn
} from "typeorm";
import { AgencyType } from "./AgencyType.entity";

@Entity()
export class Agency {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  description: string;

  @Column()
  agency_id: number;

  @Column({ unique: true })
  agency_code: string;

  @Column()
  agency_description: string;

  @Column()
  agency_boarding_disembarking: string;

  @Column()
  agency_typeId: string;

  @ManyToOne(() => AgencyType, (agency_type) => agency_type.id, { onDelete: "CASCADE" })
  @JoinColumn({ name: "agency_typeId" })
  agency_type: AgencyType;

  @Column()
  agency_status: string;

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