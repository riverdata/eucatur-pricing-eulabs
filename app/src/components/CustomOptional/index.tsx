import { useEffect, useState, FC, ReactNode } from 'react';
import { Typography, Paper, Button, Box, Container, TableContainer, Table, TableHead, TableCell, TableBody, TableRow } from '@mui/material';
import { themeScss } from '@theme';
import Search from '@components/Search';
import AddCircleIcon from "@mui/icons-material/AddCircle";


const CustomOptional: FC<{
  id: string;
  title: string;
  tableLabel: Array<string>;
  children: ReactNode;
  openModal: () => void;
}> = ({ id, title, tableLabel, children, openModal }) => {

  return (
    <Container style={{ marginTop: "20px" }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', mb: '2em' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'end', alignItems: 'center' }}>
          <Button
            id={`${id}_button_add`}
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            onClick={openModal}
            sx={{ width: { xs: '50%', sm: '15%' } }}
          >
            Adicionar
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', mt: '2em', alignItems: 'center' }}>
          <Typography id={`${id}_title`} variant="subtitle2">{title}</Typography>
          <Search id={`${id}_search`} placeholder="Pesquisar" />
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {tableLabel.map((item: string, index: number) => (
                <TableCell id={`${id}_label_${index}`} key={index}><strong>{item}</strong></TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{ mt: '2em', alignItems: 'right', whiteSpace: 'nowrap' }}>
            {children}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}


export default CustomOptional;