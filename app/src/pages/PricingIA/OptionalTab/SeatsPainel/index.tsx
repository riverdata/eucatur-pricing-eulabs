import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { generateSeats } from "@components/CustomSeats";
import { Service } from "@utils/entities";
import CustomSeatsAccordion from "@components/CustomSeatsAccordion";
import { toast } from "react-toastify";
import PageLoader from "@components/PageLoader";
import { useFetchPrices } from "@hooks/useFetchPricesIA";
import { Box, TablePagination, Button, ButtonGroup, Typography } from "@mui/material";

function getPageNumbers(currentPage: number, totalPages: number, maxButtons: number = 5) {
  let start = Math.max(0, currentPage - Math.floor(maxButtons / 2));
  let end = start + maxButtons;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(0, end - maxButtons);
  }

  const pages = [];
  for (let i = start; i < end; i++) {
    pages.push(i);
  }
  return pages;
}

export default function SeatsPainel() {
  const { setValue, getValues } = useFormContext();
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const { fetchPricesSeatsIA } = useFetchPrices();
  const prevSerialized = useRef<string>("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const paginatedServices = services.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  useEffect(() => {
    const dataService: Service[] = getValues("conclusion.servicesEnd") || [];
    const serialized = JSON.stringify(dataService);
    if (dataService.length === 0 || serialized === prevSerialized.current) return;

    const handleUpdate = async () => {
      setIsLoading(true);
      try {
        const updatedServices = dataService.map((item) => ({
          ...item,
          priceEnd: (item.priceEnd ?? []).map((price) => ({
            ...price,
            seats: price.seats ?? generateSeats(Number(item.service_seats), 46),
          })),
        }));
        
        const pricingData = await fetchPricesSeatsIA(updatedServices);
        setServices(pricingData);
        setValue("conclusion.servicesEnd", pricingData);
        prevSerialized.current = JSON.stringify(pricingData);
      } catch (error) {
        toast.error("Erro ao carregar as poltronas!");
      } finally {
        setIsLoading(false);
      }
    };

    handleUpdate();
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      {isLoading ? (
        <PageLoader />
      ) : services.length === 0 ? 
      <Typography variant="subtitle2" sx={{ display: "flex", justifyContent: "center" }}>
      Não há dados disponíveis
      </Typography> : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <CustomSeatsAccordion
            id="seats-panel"
            services={paginatedServices}
            seatUpdate={true}
          />

          <Box sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}>
            <TablePagination
              component="div"
              count={services.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage="Serviços por página"
              showFirstButton
              showLastButton
            />
            <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
              <ButtonGroup variant="outlined" size="small" aria-label="pagination">
                {getPageNumbers(page, Math.ceil(services.length / rowsPerPage)).map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={pageNum === page ? 'contained' : 'outlined'}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum + 1}
                  </Button>
                ))}
              </ButtonGroup>
            </Box>
          </Box>


        </Box>
      )}
    </>
  );
}
