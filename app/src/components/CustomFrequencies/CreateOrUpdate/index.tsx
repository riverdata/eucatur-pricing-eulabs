import { useEffect, useState, FC } from 'react';
import dayjs, { Dayjs } from "dayjs";
import { FormControl, Typography, Button, Box } from '@mui/material';
import { themeScss } from '@theme';
import CustomModal from '@components/CustomModal';
import "dayjs/locale/pt-br";
import CalendarWithHolidays from '@components/CalendarWithHolidays';
dayjs.locale("pt-br");

interface ISelectDay {
  id: string;
  name: string;
  description: string;
}

interface IFrequency {
  id?: string;
  days: ISelectDay[];
  startDate: Dayjs;
  endDate: Dayjs;
}

const CreateOrUpdateModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: IFrequency) => void;
  dataUpdate: IFrequency;
  datasLib: Dayjs[];
}> = ({ isOpen, onClose, onConfirm, dataUpdate, datasLib }) => {

  const [startDate, setStartDate] = useState<Dayjs>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());
  const [selectedDays, setSelectedDays] = useState<ISelectDay[]>([]);

  useEffect(() => {
    if (dataUpdate) {
      setSelectedDays(dataUpdate.days)
      setEndDate(dataUpdate.endDate)
      setStartDate(dataUpdate.startDate)
    }
  }, [isOpen]);

  const daysOfWeek: ISelectDay[] = [
    { id: '0', name: "Dom", description: "Domingo" },
    { id: '1', name: "Seg", description: "Segunda-feira" },
    { id: '2', name: "Ter", description: "Terça-feira" },
    { id: '3', name: "Qua", description: "Quarta-feira" },
    { id: '4', name: "Qui", description: "Quinta-feira" },
    { id: '5', name: "Sex", description: "Sexta-feira" },
    { id: '6', name: "Sab", description: "Sábado" },
  ];

  const handleDayToggle = (day: ISelectDay) => {
    setSelectedDays((prevDays) =>
      prevDays.some((d) => d.id === day.id)
        ? prevDays.filter((d) => d.id !== day.id)
        : [...prevDays, day]
    );
  };

  const handleSubmit = () => {
    let newData: IFrequency
    if (dataUpdate) {
      newData = {
        id: dataUpdate.id,
        days: selectedDays,
        startDate,
        endDate,
      };
    } else {
      newData = {
        days: selectedDays,
        startDate,
        endDate,
      };
    }

    onConfirm(newData);
    setSelectedDays([]);
    setEndDate(dayjs());
    setStartDate(dayjs());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div>
      <CustomModal
        type="modal_CustomFrequencies"
        isOpen={isOpen}
        title="Adicione novo período de datas"
        handleSubmit={handleSubmit}
        onClose={onClose}
      >
        <Box id="modal_CustomFrequencies_description" sx={{ mt: 2, mb: 2 }}>
          <Box display="inline-flex" flexDirection="column" gap={3} >
            <FormControl>
              <Typography id={`modal_CustomFrequencies_days`} variant="body1">
                Selecione os dias da semana
              </Typography>
              <Box sx={{
                display: "inline-flex", flexDirection: { xs: "column", sm: "row" }, gap: { xs: 2, sm: 1 }, paddingTop: { xs: 0, sm: 2 }
              }} >
                {daysOfWeek.map((day) => (
                  <Button
                    id={`modal_CustomFrequencies_days_${day.id}`}
                    key={day.id}
                    sx={{
                      backgroundColor: selectedDays.some((d) => d.id === day.id) ? themeScss.button.default.bgColor : themeScss.button.default.bgColorSecundary,
                      color: selectedDays.some((d) => d.id === day.id) ? themeScss.button.default.color : themeScss.button.default.colorSecundary
                    }}
                    onClick={() => handleDayToggle(day)}
                  >
                    {day.description}
                  </Button>
                ))}
              </Box>
            </FormControl>
            <Box sx={{
              display: "inline-flex", flexDirection: { xs: "column", sm: "row" }, gap: { xs: 2, sm: 1 }, paddingTop: { xs: 0, sm: 2 }
            }}>
              <CalendarWithHolidays label="Data Inicial" id={`modal_CustomFrequencies_startDate`} name="startDate" onChange={(newValue) => setStartDate(newValue!)} value={startDate} datasLiberadas={datasLib} />
              <CalendarWithHolidays minDate={startDate} label=" Data Final" id={`modal_CustomFrequencies_endDate`} name="endDate" onChange={(newValue) => setEndDate(newValue!)} value={endDate} datasLiberadas={datasLib} />
            </Box>
          </Box>
        </Box>
      </CustomModal>
    </div >
  );
}


export default CreateOrUpdateModal;