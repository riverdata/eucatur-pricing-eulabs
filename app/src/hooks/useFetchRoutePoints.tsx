import { useFormContext } from "react-hook-form";
import { ExternalService, Line, RoutePoints, Service } from "@utils/entities";
import { ExternalServices } from "@utils/services/api/Externalservices";
import { RoutePointsService } from "@utils/services/api/routePoints";

const extractSections = (items: Service[]) => items.flatMap(item =>
  item.sections.map(section => section.code)
);

export const useFetchRoutePoints = () => {
  const { getValues, setValue } = useFormContext();

  const fetchData = async (dataSections: string[], lines: Line[]): Promise<RoutePoints[]> => {
    try {
      let fetchedData: RoutePoints[] = []

      if (lines.length > 0) {
        for (let index = 0; index < lines.length; index++) {
          const line = lines[index];
          const response = await RoutePointsService.listByLine(line.line_code);
          const data = response.data.filter(item => dataSections.length > 0 ? dataSections.includes(item.sectional_code) : true);

          fetchedData = [...fetchedData, ...data]
        }
      }

      setValue("conclusion.optionalDetails.itineraries", fetchedData);

      return fetchedData
    } catch (error) {
    }
  };
  const fetchRoutePoints = (optionalDetails): Promise<RoutePoints[]> => {
    let dataSections: string[] = []
    dataSections = [...dataSections, ...extractSections(optionalDetails?.servicesEnd)]
    const uniqueDataSections = Array.from(new Set(dataSections));

    return fetchData(uniqueDataSections, optionalDetails)
  };
  return { fetchRoutePoints };
};
