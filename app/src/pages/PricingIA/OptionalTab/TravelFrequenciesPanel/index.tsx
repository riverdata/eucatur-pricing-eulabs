import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useFormContext } from "react-hook-form";
import PageLoader from "@components/PageLoader";
import { toast } from "react-toastify";
import CustomFrequencies from "@components/CustomFrequencies";

interface ISelectDay {
  id: string;
  name: string;
  description: string;
}

interface IFrequency {
  id: string;
  days: ISelectDay[];
  startDate: Dayjs;
  endDate: Dayjs;
}

export default function TravelFrequenciesPainel() {
  const {
    setValue,
    getValues
  } = useFormContext();

  const [data, setData] = useState<IFrequency[]>(getValues("conclusion.optionalDetails.travelfrequencies"));
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  useEffect(() => {

    const fetchData = async () => {
      try {
        setIsLoading(true);

        const forecastDateFromForm = getValues("conclusion.optionalDetails.travelfrequencies") || [];
        const parsedForecastDate = forecastDateFromForm.map((period: any) => ({
          ...period,
          startDate: dayjs(period.startDate),
          endDate: dayjs(period.endDate),
        }));
        setData(parsedForecastDate);

      } catch (error) {
        toast.error("Erro ao buscar dados de viagens!");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

  }, []);
  const handleUpdateForm = async (updatedData: IFrequency[]) => {
    setData(updatedData);
    setValue("conclusion.optionalDetails.travelfrequencies", updatedData);
  };


  return (
    <>
      {isLoading ? <PageLoader id="travel-frequencies__page-loader" /> :
        <CustomFrequencies dataFrequency={data} handleUpdateForm={handleUpdateForm} status={false} />
      }
    </>
  );
};

