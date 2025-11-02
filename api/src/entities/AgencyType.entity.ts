import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  AfterUpdate,
  OneToMany
} from "typeorm";
import { Agency } from "./Agency.entity";

@Entity()
export class AgencyType {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  description: string;

  @Column()
  agency_code: string;

  @Column({ unique: true })
  agency_type: string;

  @OneToMany(() => Agency, (agency_type) => agency_type.agency_type, {
    cascade: true,
  })
  agency_types: Agency[];

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