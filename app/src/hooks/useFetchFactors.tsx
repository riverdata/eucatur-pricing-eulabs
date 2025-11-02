import { FactorIA, IFactorAddIA, Price, Service } from "@utils/entities";

const seatClasses = [
  { sourceName: 'Poltrona Convencional', type: 'Convencional', weight: 0 },
  { sourceName: 'Poltrona Executiva', type: 'Executivo', weight: 0.03 },
  { sourceName: 'Poltrona Leito', type: 'Leito', weight: 0.25 },
  { sourceName: 'Poltrona Leito Conjugado', type: 'Leito Conjugado', weight: 0.2 },
  { sourceName: 'Poltrona Semi Leito', type: 'Semi Leito', weight: 0.18 },
  { sourceName: 'Poltrona Econômica', type: 'Econômico', weight: -1.5 },
  { sourceName: 'Poltrona Mulher', type: 'Espaço Mulher', weight: 0.08 },
  { sourceName: 'Poltrona Conforto', type: 'Espaço Confort', weight: 0.1 },
  { sourceName: 'Poltrona Panorâmica', type: 'Espaço Panorâmico', weight: 0.15 },
];

export const useFetchFactors = () => {

  const fetchFactors = async (services: Service[]): Promise<{
    setupFactors: Service[];
  }> => {
    try {

      let setupFactors: Service[] = [];

      setupFactors = services.map(item => {

        const priceEnd = item.priceEnd.map(price => {
          const lambda = [...Object.keys(price.precision.previsoes_df.Valor).map((key) => ({
            id: key,
            type: (price.precision.previsoes_df.Lambda[key]).split('_').slice(1).join(' '),
            value: price.precision.previsoes_df.Valor[key],
            valueIA: price.precision.previsoes_df.Valor[key],
            percentageIA: Number((price.precision.previsoes_df.Valor[key] * 100)),
            percentage: Number((price.precision.previsoes_df.Valor[key] * 100))
          }))]


          const seats = Object.entries(price.precision.precos).map(([type, value]) => {
            const mapped = seatClasses.find(sc => sc.sourceName === type);
            const mappedType = mapped?.type ?? type;

            return {
              type: mappedType,
              value: Number(value),
              rpkm_valueIA: price.precision.rpkm_values[type],
              valueIA: Number(value),
              rpkm_value: price.precision.rpkm_values[type],
              percentageIA: Number((((Number(value) - price.precision.tarifa_base) / price.precision.tarifa_base) * 100)),
              percentage: Number((((Number(value) - price.precision.tarifa_base) / price.precision.tarifa_base) * 100))
            };
          });


          return {
            ...price,
            factors: [{
              id: "0",
              description: "Lambdas",
              factor_value: price.precision.lambda_final,
              factor_valueIA: price.precision.lambda_final,
              factor_percentage: Number((price.precision.lambda_final * 100)),
              factor_weight_add: lambda
            },
            {
              id: "1",
              description: "Poltronas",
              factor_value: 0,
              factor_valueIA: 0,
              factor_percentage: 0,
              factor_weight_add: seats.map((subfactoR, index: number) => {
                return {
                  id: index.toString(),
                  ...subfactoR
                };
              })
            }]
          }
        })

        return {
          ...item,
          priceEnd: priceEnd
        }
      })
      return {
        setupFactors
      }
    } catch (error: any) {
      throw new Error("Erro modificado: " + error.message);
    }
  };

  const calculation = async (services: Service[]): Promise<{
    calculated: Service[];
  }> => {
    try {

      const calculated = services.map((serv: Service) => {
        return {
          ...serv,
          priceEnd: serv.priceEnd.map((price: Price) => {
            //novos valores de lambdas

            const updatedFactors = price.factors[0].factor_weight_add.map((subfator: IFactorAddIA) => {
              const value = subfator.percentage === subfator.percentageIA ? subfator.value : (subfator.percentage / 100);

              return { ...subfator, value };
            });

            const lambdaFinal = updatedFactors.reduce((acc, curr) => acc + (curr.value ?? 0), 0) + 1;
            let newLambdas = { ...price.factors[0], factor_value: lambdaFinal, factor_weight_add: updatedFactors }

            //Calculo das poltronas
            const KM = price.precision?.route_km ?? 1;

            const updateSeats = price.factors[1].factor_weight_add.map((subfator: IFactorAddIA) => {
              const seat = seatClasses.filter(seat => seat.type === subfator.type)
              const newValue = ((price.precision.tarifa_base * (lambdaFinal + seat[0].weight)) * (1 + subfator.percentage / 100))

              return {
                ...subfator,
                value: newValue,
                rpkm_value: (newValue * 1 / KM)
              };
            });
            let newSeats = { ...price.factors[1], factor_weight_add: updateSeats }


            return { ...price, factors: [newLambdas, newSeats] };
          })
        }

      });


      return { calculated };
    } catch (error: any) {
      throw new Error("Erro ao recalcular os valores: " + error.message);
    }
  };

  const calculationFactor = async (price: Price): Promise<{
    factorsCalculated: Price;
  }> => {
    try {

      const updatedFactors = price.factors[0].factor_weight_add.map((subfator: IFactorAddIA) => {
        const value = subfator.percentage === subfator.percentageIA ? subfator.value : (subfator.percentage / 100);
        
        return { ...subfator, value };
      });

      const lambdaFinal = updatedFactors.reduce((acc, curr) => acc + (curr.value ?? 0), 0) + 1;
      let newLambdas = { ...price.factors[0], factor_value: lambdaFinal, factor_weight_add: updatedFactors }
      const lambdaInicial = price.factors[0].factor_valueIA;
      //Calculo das poltronas
      const KM = price.precision?.route_km ?? 1;

      const updateSeats = price.factors[1].factor_weight_add.map((subfator: IFactorAddIA) => {
        const seat = seatClasses.filter(seat => seat.type === subfator.type)
        const newValue = (subfator.percentage === subfator.percentageIA && lambdaInicial === lambdaFinal) ? subfator.value : ((price.precision.tarifa_base * (lambdaFinal + seat[0].weight)) * (1 + subfator.percentage / 100))

        return {
          ...subfator,
          value: newValue,
          rpkm_value: (newValue * 1 / KM)
        };
      });
      let newSeats = { ...price.factors[1], factor_weight_add: updateSeats }


      return { factorsCalculated: { ...price, factors: [newLambdas, newSeats] } };

    } catch (error: any) {
      throw new Error("Erro ao recalcular os valores: " + error.message);
    }
  };


  return { calculation, fetchFactors, calculationFactor };
};
