import { CategoryService } from "@utils/services/api/category";
import { Category, Line, Service } from "@utils/entities";

const extractClass = (items: Service[]) =>
  items.reduce((acc, item) =>
    acc.concat(item.class.filter(value => typeof value === 'string')), []
  );

const extractClassLine = (items: Line[]) =>
  items.reduce((acc, item) =>
    acc.concat(item.line_class.filter(value => typeof value === 'string')), []
  );

export const useFetchCategories = () => {

  const filterClass = (services: Service[], lines: Line[]) => {
    let dataClass: string[] = []

    if (services.length > 0) {
      dataClass = [...dataClass, ...extractClass(services)]
    }
    if (dataClass.length === 0 && lines.length > 0) {
      dataClass = [...dataClass, ...extractClassLine(lines)]
    }

    return Array.from(new Set(dataClass));
  };

  const fetchData = async (dataClass: string[]) => {
    try {
      const response = await CategoryService.list();
      const fetchedData = response.data
        .map((item: Category) => ({
          id: item.id,
          description: item.description,
          class_code: item.class_code,
          class_description: item.class_description,
        }))
        .filter((item: Category) =>
          dataClass.length > 0 ? dataClass.includes(item.class_code) : true
        );

      return fetchedData
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  const fetchCategories = (services: Service[], lines: Line[]): Promise<Category[]> => {
    let dataClass: string[] = filterClass(services, lines)
    return fetchData(dataClass)
  };
  return { fetchCategories };
};
