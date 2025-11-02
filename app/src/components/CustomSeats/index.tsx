import { useState, FC } from 'react';
import {
  Button,
  Box,
  Tabs,
  Tab,
  Chip
} from "@mui/material";
import { themeScss } from "@theme";

import { Seats, Service } from '@utils/entities';


function seatsType(quantity: number, id: number): string {
  const ComfortArray = {
    "44": [8, 7],
    "62": [20, 19],
    "59": [20, 19]
  };
  const WomanArray = {
    "62": [9, 10, 13, 14],
    "59": [9, 10, 13, 14]
  };

  if (WomanArray[quantity]?.includes(id)) {
    return "Espaço Mulher";
  } else if (id <= 4) {
    return "Espaço Panorâmico";
  } else if (ComfortArray[quantity]?.includes(id)) {
    return "Espaço Confort";
  } else if (id >= 37) {
    return "Econômico";
  }
  return "Normal";
}

export const generateSeats = (quantity: number, limit: number) => {
  const firstFloorLimit = limit;
  const hasSecondFloor = quantity > firstFloorLimit;

  const seats: Seats[] = Array.from({ length: quantity }, (_, i) => {
    const seatNumber = i + 1;

    return {
      id: seatNumber,
      status: "available",
      type: seatsType(quantity, seatNumber),
      weight: 0,
      floor: hasSecondFloor && seatNumber > firstFloorLimit ? 2 : 1,
      price: 0,
      subArray: 0
    };
  });

  const firstFloorSeats = seats.filter(seat => seat.floor === 2);
  const secondFloorSeats = seats.filter(seat => seat.floor === 1);

  let groupedSeatsSecond = secondFloorSeats.reduce(
    (acc, seat) => {
      if (quantity < limit) {
        const remainder = seat.id % 4;
        const seatWithGroup = {
          ...seat,

          subArray: (remainder === 1 || seat.id === 43) ? 0 : (remainder === 2 || seat.id === 44) ? 1 : remainder === 3 ? 3 : 2,
        };

        acc[(remainder === 1 || seat.id === 43) ? 0 : (remainder === 2 || seat.id === 44) ? 1 : remainder === 3 ? 3 : 2].push(seatWithGroup);

        return acc;
      } else {
        const remainder = seat.id % 4;
        const seatWithGroup = {
          ...seat,
          subArray: (remainder === 1 || seat.id === 15) ? 0 : (remainder === 2 || seat.id === 16) ? 1 : remainder === 3 ? 3 : 2,
        };

        acc[(remainder === 1 || seat.id === 15) ? 0 : (remainder === 2 || seat.id === 16) ? 1 : remainder === 3 ? 3 : 2].push(seatWithGroup);

        return acc;
      }

    },
    [[], [], [], []] as Array<Array<typeof seats[0]>>
  );

  let groupedSeatsFirst = []
  const seatsNotExist = [47, 48, 52, 56, 60];
  if (firstFloorSeats.length > 0) {
    groupedSeatsFirst = firstFloorSeats.reduce(
      (acc, seat) => {
        if (!seatsNotExist.includes(seat.id)) {
          const remainder = seat.id % 4;
          const seatWithGroup = {
            ...seat,
            subArray: remainder === 1 ? 0 : remainder === 2 ? 1 : remainder === 3 ? 3 : 2,
          };

          acc[remainder === 1 ? 0 : remainder === 2 ? 1 : remainder === 3 ? 3 : 2].push(seatWithGroup);
          return acc;
        }
        return acc;
      },
      [[], [], [], []] as Array<Array<typeof seats[0]>>
    );
  }

  return [groupedSeatsFirst, groupedSeatsSecond];
}

export const getButtonColor = (status: string) => {
  switch (status) {
    case "occupied":
      return themeScss.color.error;
    default:
      return themeScss.color.primary;

  }
};

export const getButtonBackColor = (type: string, isBorder: boolean) => {
  if (isBorder) {
    switch (type) {
      case "Espaço Mulher":
        return themeScss.Seatcolor.dark.woman;
      case "Espaço Panorâmico":
        return themeScss.Seatcolor.dark.panoramic;
      case "Espaço Confort":
        return themeScss.Seatcolor.dark.comfort;
      case "Econômico":
        return themeScss.Seatcolor.dark.economic;
      default:
        return themeScss.Seatcolor.dark.default;
    }
  } else {
    switch (type) {
      case "Espaço Mulher":
        return themeScss.Seatcolor.woman;
      case "Espaço Panorâmico":
        return themeScss.Seatcolor.panoramic;
      case "Espaço Confort":
        return themeScss.Seatcolor.comfort;
      case "Econômico":
        return themeScss.Seatcolor.economic;
      default:
        return 'white';
    }
  }

};

export const getMargin = (quantity: number, id: number) => {

  if (quantity === 44 && (id === 8 || id === 7)) {
    return "5.5em";
  } else if (quantity === 62 && id === 51) {
    return "5.75em";
  } else if ((quantity === 59 || quantity === 62) && (id === 20 || id === 19)) {
    return "11.5em";
  }
  return "0.5em";
};


interface CustomSeatsProps {
  id: string;
  data: Seats[][];
  indice?: number | null;
  service: Service;
  seatUpdate: boolean;
  handleUpdate?: (service: Service, indice: number, data: Seats) => void;
}

const CustomSeats: FC<CustomSeatsProps> = ({
  id,
  data,
  indice,
  service,
  seatUpdate,
  handleUpdate
}) => {

  const [currentTab, setCurrentTab] = useState(1);
  return (
    <Box key={id} id={id} sx={{ width: "auto", display: 'flex', flexDirection: 'column', gap: 1, padding: '1em' }}>
      <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
        <Tab label="1º andar" />
        {data[1].length > 0 && <Tab label="2º andar" />}
      </Tabs>
      <Box sx={{ width: "100%", justifySelf: "left", marginTop: "0.5em", padding: "1em", display: 'flex', maxWidth: "80vw", overflowX: 'auto' }} >
        <Box sx={{
          borderRadius: '28px',
          borderWidth: '2.07px',
          backgroundColor: '#E5E5E5',
          border: 2,
          borderColor: '#8C8F92',
          padding: '1em 1em 1em 2em'
        }}>

          <Box key={id} id={id} sx={{ width: "fit-content", justifySelf: "left", border: 2, backgroundColor: '#FAFAFA', borderRadius: "31px", borderColor: '#CACACA', padding: "1em", display: 'flex', flexDirection: 'row' }}>
            <Box style={{ width: '50px', alignContent: 'flex-end'}}>
              <img
                src="/directioncar.png"
                alt="Volante"
                style={{ width: '40px', height: '40px', alignSelf: 'center' }}
              />
            </Box>
            <Box sx={{ width: "fit-content", justifySelf: "left",  display: 'flex', flexDirection: 'column', gap: 1 }}>
              {data[currentTab].map((item, index: number) => (
                <>
                  <Box key={`${id}_${indice}_${index}`} sx={{ margin: "0 0", display: 'flex', flexDirection: 'row' }}>

                    {item?.map((seat: Seats) => (
                      <Box key={`${id}_${indice}_${index}_${seat.id}`}>
                        {seatUpdate ?
                          <>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: getMargin(Number(service.service_seats), seat.id) }}>
                              <Chip label={seat.weight ? seat.weight + '%' : '-'} size="small" sx={{ backgroundColor: 'transparent', color: '#575757', fontSize: '12px', padding: '0px' }} />
                              <Button
                                id={`${id}_${indice}_${index}_${seat.id}_button_update`}
                                variant="contained"
                                onClick={() => handleUpdate(service, indice, seat)}
                                sx={{
                                  minWidth: 40,
                                  minHeight: 40,
                                  padding: 0,
                                  borderRadius: "8px",
                                  textAlign: "center",
                                  border: 1,
                                  color: getButtonColor(seat.status),
                                  backgroundColor: getButtonBackColor(seat.type, false),
                                  borderColor: getButtonBackColor(seat.type, true)
                                }}
                              >
                                {seat.id} <br />
                                {/* Braço Direito */}
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: -6,
                                    left: 6,
                                    right: 6,
                                    height: 8,
                                    width: 30,
                                    borderRadius: '6px',
                                    backgroundColor: getButtonBackColor(seat.type, false),
                                    border: '1px solid #666',
                                  }}
                                />
                                {/* Braço Esqueerdo */}
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    bottom: -6,
                                    left: 6,
                                    right: 6,
                                    height: 8,
                                    width: 30,
                                    borderRadius: '6px',
                                    backgroundColor: getButtonBackColor(seat.type, false),
                                    border: '1px solid #666',
                                  }}
                                />

                                {/* Encosto */}
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: 1,
                                    bottom: 6,
                                    right: -6,
                                    height: 35,
                                    width: 12,
                                    borderRadius: '6px',
                                    backgroundColor: getButtonBackColor(seat.type, false),
                                    border: '1px solid #666',
                                  }}
                                />
                              </Button>
                            </Box>
                          </>
                          :
                          <>
                            <Box sx={{  display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: getMargin(Number(service.service_seats), seat.id) }}>
                              <Chip label={seat.price ? 'R$ ' + seat.price : 'R$ 0'} size="small" sx={{ backgroundColor: 'transparent', color: '#575757', fontSize: '12px', padding: '0px' }} />
                              <Button
                                id={`${id}_${index}_${seat.id}_button_update`}
                                variant="contained"
                                sx={{
                                  minWidth: 40,
                                  minHeight: 40,
                                  padding: 0,
                                  borderRadius: "8px",
                                  textAlign: "center",
                                  border: 1,
                                  color: getButtonColor(seat.status),
                                  backgroundColor: getButtonBackColor(seat.type, false),
                                  borderColor: getButtonBackColor(seat.type, true)
                                }}
                              >
                                {seat.id} <br />

                                {/* Braço Direito */}
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: -6,
                                    left: 6,
                                    right: 6,
                                    height: 8,
                                    width: 30,
                                    borderRadius: '6px',
                                    backgroundColor: getButtonBackColor(seat.type, false),
                                    border: '1px solid #666',
                                  }}
                                />
                                {/* Braço Esqueerdo */}
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    bottom: -6,
                                    left: 6,
                                    right: 6,
                                    height: 8,
                                    width: 30,
                                    borderRadius: '6px',
                                    backgroundColor: getButtonBackColor(seat.type, false),
                                    border: '1px solid #666',
                                  }}
                                />

                                {/* Encosto */}
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: 1,
                                    bottom: 6,
                                    right: -6,
                                    height: 35,
                                    width: 12,
                                    borderRadius: '6px',
                                    backgroundColor: getButtonBackColor(seat.type, false),
                                    border: '1px solid #666',
                                  }}
                                />
                              </Button>
                            </Box>
                          </>}
                      </Box>
                    ))}
                  </Box>
                  {index === 1 && <Box sx={{ margin: "1em", textAlign: "center", color: themeScss.color.primary, fontWeight: "700" }}>Corredor</Box>}
                </>
              ))}
            </Box>

          </Box>
        </Box>

      </Box>

    </Box >
  );
}

export default CustomSeats;