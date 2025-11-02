export interface FactorIA {
  id: string;
  description: string;
  factor_value: number;
  factor_valueIA?: number;
  factor_percentage?: number;
  factor_weight_add: IFactorAddIA[];
}

export interface IFactorAddIA {
  oldPercentage?: number;
  id: string;
  type: string;
  value: number;
  valueIA?: number;
  percentage?: number;
  percentageIA?: number;
  rpkm_value?: number;
  rpkm_valueIA?: number;
}
