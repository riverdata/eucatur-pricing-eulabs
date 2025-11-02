import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Box,
  Typography,
  Table,
  TableCell,
  TableContainer,
  TableBody,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  FormControlLabel,
  TablePagination,
  Button,
  ButtonGroup,
} from "@mui/material";
import { toast } from "react-toastify";
import PageLoader from "@components/PageLoader";
import { useFetchPrices } from "@hooks/useFetchPricesIA";
import { Category, Service } from "@utils/entities";
import { useStepper } from "@providers/StepperProvider";
import { useFetchCategories } from "@hooks/useFetchCategories";
import dayjs, { Dayjs } from "dayjs";

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

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function getPageNumbers(
  currentPage: number,
  totalPages: number,
  maxButtons: number = 5
) {
  const total = Math.ceil(totalPages);
  let start = Math.max(0, currentPage - Math.floor(maxButtons / 2));
  let end = start + maxButtons;

  if (end > total) {
    end = total;
    start = Math.max(0, end - maxButtons);
  }

  return Array.from({ length: end - start }, (_, i) => start + i);
}

function getMatchingDatesFromPeriods(
  periods: IFrequency[],
  datesReleased: string[]
): string[] {
  const allMatchingDates: string[] = [];

  for (const period of periods) {
    const selectedDayIds = period.days.map((d) => parseInt(d.id, 10));
    let start = period.startDate.startOf("day");

    while (
      start.isBefore(period.endDate) ||
      start.isSame(period.endDate, "day")
    ) {
      const jsDay = start.day();
      if (selectedDayIds.includes(jsDay)) {
        allMatchingDates.push(start.format("YYYY-MM-DD"));
      }
      start = start.add(1, "day");
    }
  }
  return allMatchingDates.filter((item) => datesReleased.includes(item));
}

const extrairDatasUnicas = (array: Service[]): string[] => {
  if (!array.length) return [dayjs().format("YYYY-MM-DD")];

  return Array.from(
    new Set(
      array.map((service) =>
        dayjs(service.service_departure_date).format("YYYY-MM-DD")
      )
    )
  );
};

export default function SearchTravel() {
  const { setValue, getValues, watch } = useFormContext();

  const { fetchPricesIA } = useFetchPrices();
  const { fetchCategories } = useFetchCategories();
  const { setLoading } = useStepper();

  const [servicesRows, setServicesRows] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const services = watch("conclusion.services");
  const selectedLine = watch("conclusion.calculationIA.line");
  const forecastDate = watch("conclusion.calculationIA.forecastDate") || [];
  const selectedServices = watch("conclusion.selectedServices") || [];

  const currentPageRows = servicesRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // agora compara somente por id
  const allCurrentPageSelected =
    currentPageRows.length > 0 &&
    currentPageRows.every((row) =>
      selectedServices.some((item) => item.id === row.id)
    );

  const toggleSelectAll = (checked: boolean) => {
    let updated: Service[];

    if (checked) {
      const newItems = currentPageRows.filter(
        (row) => !selectedServices.some((item) => item.id === row.id)
      );
      updated = [
        ...selectedServices,
        ...newItems.filter((n) => !selectedServices.some((s) => s.id === n.id)),
      ];
    } else {
      updated = selectedServices.filter(
        (item) => !currentPageRows.some((row) => row.id === item.id)
      );
    }

    setValue("conclusion.selectedServices", updated);
  };

  const fetchSeats = async (
    servicesFilter: Service[],
    category: Category[]
  ) => {
    try {
      const itineraries = getValues("conclusion.calculationIA.itineraries");
      const dataSeats = await fetchPricesIA(
        servicesFilter,
        category,
        itineraries
      );

      if (dataSeats.length === 0) {
        throw new Error(
          "É necessário selecionar um período que contenha viagens!"
        );
      }
      
      const currentSelected = getValues("conclusion.selectedServices") || [];
      const selectedIds = currentSelected.map((s: Service) => s.id);
      const stillValidSelected = dataSeats.filter((s) =>
        selectedIds.includes(s.id)
      );

      setServicesRows(dataSeats);
      setValue("conclusion.services", dataSeats);
      setValue("conclusion.selectedServices", stillValidSelected);
      
      toast.success("Viagens encontradas com sucesso!");

      setIsLoading(false);
    } catch (error: any) {
      toast.error(error?.message || "Não foram encontradas viagens!");
      setIsLoading(false);
    }
  };

  const updateForecastAndServices = async (datesReleased: string[]) => {
    try {
      const dateForecast = getMatchingDatesFromPeriods(
        forecastDate,
        datesReleased
      );
      let servicesLocal: Service[] = [];
      for (const dateValue of dateForecast) {
        const dataServiceSelected = services.filter((service: Service) => {
          return (
            service.service_departure_date ===
            dayjs(dateValue).format("YYYY-MM-DD")
          );
        });
        servicesLocal = [...servicesLocal, ...dataServiceSelected];
      }
      if (servicesLocal.length === 0) {
        throw new Error(
          "É necessário selecionar um período de datas que contenha viagens!"
        );
      }

      const data = await fetchCategories(servicesLocal, [selectedLine]);
      setValue("conclusion.optionalDetails.categories", data);
      return { service: servicesLocal, category: data };
    } catch (error) {
      throw error;
    }
  };

  const fetchDates = async (servicesParam?: Service[]) => {
    setIsLoading(true);
    setLoading(true);
    try {
      const baseServices = servicesParam;
      const datasUnicas = extrairDatasUnicas(baseServices);
      const { service, category } = await updateForecastAndServices(
        datasUnicas
      );

      await fetchSeats(service, category);
    } catch (error: any) {
      toast.error(error?.message || "Erro ao buscar datas!");
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (row: Service, checked: boolean) => {
    const updated = checked
      ? [...selectedServices.filter((s: Service) => s.id !== row.id), row]
      : selectedServices.filter((item: Service) => item.id !== row.id);

    setValue("conclusion.selectedServices", updated);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    fetchDates(services);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const maxPage = Math.max(
      0,
      Math.ceil(servicesRows.length / rowsPerPage) - 1
    );
    if (page > maxPage) setPage(maxPage);
  }, [servicesRows, rowsPerPage]);

  useEffect(() => {
    if (selectedServices.length > 0) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [selectedServices]);

  return (
    <Box
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Box sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 2, mb: 2 }}>
        <Typography
          sx={{
            display: "flex",
            flexDirection: "column",
            fontSize: "1rem",
            fontWeight: 500,
            color: "text.primary",
          }}
        >
          <span>
            <strong>Seção destinada à seleção dos horários e dias</strong> que
            serão considerados pela Inteligência Artificial para a realização
            dos cálculos de precificação.
          </span>
          <span>
            <strong>Observação:</strong> Quanto mais dias selecionados, maior
            será o tempo necessário para receber as respostas.
          </span>
        </Typography>
      </Box>

      {isLoading ? (
        <PageLoader />
      ) : servicesRows.length === 0 ? (
        <Typography variant="subtitle2" sx={{ textAlign: "center" }}>
          Não há dados disponíveis
        </Typography>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            Horários disponíveis na linha selecionada
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={allCurrentPageSelected}
                          onChange={(e) => toggleSelectAll(e.target.checked)}
                        />
                      }
                      label=""
                      sx={{ mb: 1 }}
                    />
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    Data/Hora de saída
                  </TableCell>
                  <TableCell>Origem</TableCell>
                  <TableCell>Destino</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Tarifa Base</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentPageRows.map((serv, index) => {
                  const isChecked = selectedServices.some(
                    (item: Service) => item.id === serv.id
                  );

                  return (
                    <TableRow key={serv.id ?? index}>
                      <TableCell>
                        <Checkbox
                          checked={isChecked}
                          onChange={(e) =>
                            handleCheckboxChange(serv, e.target.checked)
                          }
                        />
                      </TableCell>
                      <TableCell>{serv.description}</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {serv.price?.secctional_origin_description || ""}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {serv.price?.secctional_destiny_description || ""}
                      </TableCell>
                      <TableCell>
                        {serv.price?.class_description || ""}
                      </TableCell>
                      <TableCell>
                        {currencyFormatter.format(serv.price?.amount || 0)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}>
            <TablePagination
              component="div"
              count={servicesRows.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="Linhas por página"
              showFirstButton
              showLastButton
            />

            {servicesRows.length > 0 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                <ButtonGroup
                  variant="outlined"
                  size="small"
                  aria-label="pagination"
                >
                  {getPageNumbers(
                    page,
                    Math.ceil(servicesRows.length / rowsPerPage)
                  ).map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={pageNum === page ? "contained" : "outlined"}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum + 1}
                    </Button>
                  ))}
                </ButtonGroup>
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
