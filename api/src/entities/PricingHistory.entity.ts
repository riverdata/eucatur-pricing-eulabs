import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  AfterUpdate,
  AfterLoad,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate
} from "typeorm";
import { Line } from "./Line.entity";
import dayjs from "dayjs";
import { basedecode, baseencode } from "../utils/compressed";

function getValidPurchaseDates(periods: any[]) {
  const validDatesSet = new Set<string>();

  for (const period of periods) {
    const selectedDayIds = period.days.map((d: any) => parseInt(d.id, 10));
    let start = dayjs(period.startDate).startOf('day');
    const end = dayjs(period.endDate).endOf('day');

    while (start.isBefore(end) || start.isSame(end, 'day')) {
      const jsDay = start.day();
      if (selectedDayIds.includes(jsDay)) {
        validDatesSet.add(start.format('YYYY-MM-DD'));
      }
      start = start.add(1, 'day');
    }
  }

  const validDates = Array.from(validDatesSet);
  validDates.sort((a, b) => dayjs(a).isBefore(dayjs(b)) ? -1 : 1);

  return validDates;
}

function getForecastDate(items: any[]): string[] {
  const validDatesSet = new Set<string>();

  items.forEach(item => {
    validDatesSet.add(item.service_departure_date);
  });
  const validDates = Array.from(validDatesSet);
  validDates.sort((a, b) => dayjs(a).isBefore(dayjs(b)) ? -1 : 1);

  return validDates;
};

export enum PricingStatus {
  PENDING_APPROVAL = 'pending_approval',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  INACTIVE = 'inactive',
  SCHEDULED = 'scheduled',
}

type OptionalDetail = {
  agencies?: object[]; 
  categories?: object[]; 
};

@Entity()
export class PricingHistory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false, unique: true })
  pricing_code: string;

  @Column({ nullable: false, unique: true })
  description: string;

  @Column({ nullable: true, default: null })
  lineId: string;

  @ManyToOne(() => Line, (line) => line.id, { onDelete: "SET NULL" })
  @JoinColumn({ name: "lineId" })
  line: Line;

  @Column('jsonb', { nullable: false })
  timePurchase: object;

  @Column('text', { nullable: false })
  itineraries: string;
  itinerariesDecoded: object[];

  @Column('jsonb', { nullable: false })
  forecastDate: object[];

  @Column('jsonb', { nullable: false })
  purchaseDates: object[];
  purchaseDatesFormat: string[];

  @Column('text', { nullable: false })
  optionalDetails: string;
  optionalDetailsDecoded: OptionalDetail;

  @Column('text', { nullable: false })
  servicesEnd: string;
  servicesEndDecoded: object[];

  forecastDateFormat: string[];

  @Column({
    type: "enum",
    enum: PricingStatus,
    default: PricingStatus.PENDING_APPROVAL,
  })
  status: PricingStatus;

  statusText: string | undefined;

  @AfterLoad()
  setComputed() {
    switch (this.status) {
      case PricingStatus.ACTIVE: {
        this.statusText = "Ativa";
        break;
      }
      case PricingStatus.INACTIVE: {
        this.statusText = "Inativa";
        break;
      }
      case PricingStatus.PENDING_APPROVAL: {
        this.statusText = "Aguardando revisão";
        break;
      }
      case PricingStatus.EXPIRED: {
        this.statusText = "Expirada";
        break;
      }
      case PricingStatus.SCHEDULED: {
        this.statusText = "Aguardando Ativação";
        break;
      }
      default: {
        this.statusText = undefined;
        break;
      }
    }

    try {
      this.servicesEndDecoded = basedecode(this.servicesEnd);
      this.forecastDateFormat = getForecastDate(this.servicesEndDecoded);
    } catch (err) {
      console.error('Erro ao decodificar servicesEnd:', err);
      this.forecastDateFormat = [];
    }

    try {
      this.itinerariesDecoded = basedecode(this.itineraries);
      this.optionalDetailsDecoded = basedecode(this.optionalDetails);
    } catch (err) {
      console.error('Erro ao decodificar itineraries:', err);
    }

    this.purchaseDatesFormat = getValidPurchaseDates(this.purchaseDates);

  }

  @Column()
  activationDate: Date;

  @Column()
  expiresAt: Date;

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

  @BeforeInsert()
  encodeFields() {
    if (typeof this.servicesEnd !== 'string') {
      this.servicesEnd = baseencode(this.servicesEnd);
    }

    if (typeof this.itineraries !== 'string') {
      this.itineraries = baseencode(this.itineraries);
    }

    if (typeof this.optionalDetails !== 'string') {
      this.optionalDetails = baseencode(this.optionalDetails);
    }
  }

}