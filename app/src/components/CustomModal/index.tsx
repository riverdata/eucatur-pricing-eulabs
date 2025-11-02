import { useEffect, useState, FC, ReactNode } from 'react';
import { Typography, Modal, Button, Box } from '@mui/material';
import { themeScss } from '@theme';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '80%', md: '50%' },
  bgcolor: themeScss.modal.bgColor,
  borderRadius: themeScss.modal.borderRadius,
  boxShadow: themeScss.modal.boxShadow,
  p: 4,
  overflow: 'auto',
  maxHeight: '80%'
};

const CustomModal: FC<{
  isOpen: boolean;
  type: string;
  title: string;
  children: ReactNode;
  handleSubmit?: () => void;
  onClose: () => void;
}> = ({ isOpen, type, title, children, handleSubmit, onClose }) => {

  if (!isOpen) return null;

  return (
    <div>
      <Modal
        open={isOpen}
        aria-labelledby={`modal-${type}`}
        aria-describedby={`modal-${type}`}
        onClose={onClose}
      >
        <Box sx={style}>
          <Typography id={`modal_${type}_title`} variant="h6" component="h2">
            {title}
          </Typography>
          <Box id={`modal_${type}_description`} sx={{ mt: 2, mb: 2 }}>
            {children}
          </Box>
          {handleSubmit && <Button id={`modal_${type}_save`} onClick={handleSubmit}>
            Salvar
          </Button>}

        </Box>
      </Modal >
    </div >
  );
}


export default CustomModal;