export interface Factor {
  id: string;
  description: string;
  factor_code: string;
  factor_description: string;
  factor_weight: number;
  factor_weight_add: IFactorAdd[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface IFactorAdd {
  id: string;
  title: string;
  description?: string;
  value: number;
  newValue?: number;
}
