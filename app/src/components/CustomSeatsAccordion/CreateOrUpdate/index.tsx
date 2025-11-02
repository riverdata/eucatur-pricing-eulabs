import { useEffect, useState, FC } from 'react';
import { Box, Slider, Typography } from '@mui/material';
import CustomModal from '@components/CustomModal';
import { Seats, Service } from '@utils/entities';

const CreateOrUpdateModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (service: Service, indice: number, seat: Seats) => void;
  dataUpdate: { service: Service; indice: number; seat: Seats };
}> = ({ isOpen, onClose, onConfirm, dataUpdate }) => {

  const [selectedData, setSelectedData] = useState<{ service: Service; indice: number; seat: Seats }>();

  useEffect(() => {
    if (dataUpdate) setSelectedData(dataUpdate)
  }, [isOpen]);

  const handlePesoChange = (item: Seats, newValue: number) => {
    setSelectedData({ service: dataUpdate.service, indice: dataUpdate.indice, seat: { ...item, weight: newValue } });
  };

  const handleSubmit = () => {
    onConfirm(selectedData.service, selectedData.indice, selectedData.seat);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div>
      <CustomModal
        type="SeatsPainel"
        isOpen={isOpen}
        title=""
        handleSubmit={handleSubmit}
        onClose={onClose}
      >
        <Box display="inline-flex" flexDirection="column" marginTop={3} width={`100%`} >
          <Typography id={`modal_SeatsPainel_label`} variant="body1" >
            Peso da Poltrona: {selectedData?.seat.id}
          </Typography>
          <Box
            sx={{
              border: "1px solid #ddd",
              borderRadius: 2,
              padding: 1,
              display: "flex",
              alignItems: "center",
              gap: 2,
              marginTop: 2
            }}
          >
            <Box sx={{ minWidth: 50, textAlign: "center" }}>
              <Typography variant="body1" id="modal_SeatsPainel_weight">
                {selectedData?.seat.weight}%
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Slider
                id="modal_SeatsPainel_slider"
                value={selectedData?.seat.weight ?? 0}
                onChange={(event, value) => handlePesoChange(selectedData.seat!, value as number)}
                min={-100}
                max={100}
              />
            </Box>
          </Box>
        </Box>
      </CustomModal>
    </div >
  );
}


export default CreateOrUpdateModal;