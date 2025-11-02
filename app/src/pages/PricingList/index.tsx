import "./PricingList.scss";
import RootLayout from "@components/Layout";
import { useEffect, useState, FC, ReactNode } from 'react';
import { Typography, Collapse, Paper, Button, Grid2, Chip, Box, Container, TableContainer, Table, TableHead, TableCell, TableBody, TableRow, IconButton, Menu, MenuItem, InputLabel, FormControl, Select } from '@mui/material';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Routes from "@routes/paths";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import Search from "@components/Search";
import { PricingHistory, PricingStatus } from "@utils/entities";
import { PricingHistoryService } from "@utils/services/api/pricingHistory";
import { toast } from "react-toastify";
import PageLoader from "@components/PageLoader";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import dayjs from "dayjs";
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import TouchAppIcon from '@mui/icons-material/TouchApp';

import React from "react";

export default function PricingListScreen() {
  const navigate = useNavigate();
  const [data, setData] = useState<PricingHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [openRowId, setOpenRowId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedHistory, setSelectedHistory] = useState<PricingHistory | null>(null);
  const filteredData = statusFilter === 'all'
    ? data
    : data.filter((item) => item.status === statusFilter);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await PricingHistoryService.list();
        setData(data.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.error(error.response.data.message);
      }
    };
    fetchData();
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRemove = async (pricing: PricingHistory) => {
    try {
      handleClose();
      setIsLoading(true);
      const id = pricing.id;
      await PricingHistoryService.delete(id);
      const data = await PricingHistoryService.list();
      setData(data.data);
      setIsLoading(false);
      toast.success(`Precificação deletada com sucesso.`);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const statusTransitions: Partial<Record<PricingStatus, { next: PricingStatus; label: string; icon: JSX.Element; color: 'success' | 'warning' }>> = {
    [PricingStatus.PENDING_APPROVAL]: {
      next: PricingStatus.SCHEDULED,
      label: 'Aprovar',
      icon: <CheckCircleRoundedIcon fontSize="small" sx={{ marginRight: 1 }} />,
      color: 'success',
    },
    [PricingStatus.SCHEDULED]: {
      next: PricingStatus.PENDING_APPROVAL,
      label: 'Revisar',
      icon: <AutoFixHighIcon fontSize="small" sx={{ marginRight: 1 }} />,
      color: 'success',
    },
    [PricingStatus.ACTIVE]: {
      next: PricingStatus.INACTIVE,
      label: 'Desativar',
      icon: <BlockIcon fontSize="small" sx={{ marginRight: 1 }} />,
      color: 'warning',
    },
    [PricingStatus.INACTIVE]: {
      next: PricingStatus.ACTIVE,
      label: 'Ativar',
      icon: <CheckCircleIcon fontSize="small" sx={{ marginRight: 1 }} />,
      color: 'success',
    },
  };

  const handleStatusChange = async (pricing: PricingHistory) => {
    handleClose();
    const transition = statusTransitions[pricing.status];
    if (!transition) {
      toast.error('Ação não permitida para este status.');
      return;
    }

    try {
      setIsLoading(true);
      await PricingHistoryService.update({ id: pricing.id, status: transition.next });

      const data = await PricingHistoryService.list();
      setData(data.data);
      setIsLoading(false);

      toast.success('Status atualizado com sucesso!');
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const handleActiveManual = async (pricing: PricingHistory) => {
    try {
      handleClose();
      setIsLoading(true);

      await PricingHistoryService.update({ id: pricing.id, status: PricingStatus.ACTIVE });
      const data = await PricingHistoryService.list();
      setData(data.data);
      setIsLoading(false);
      toast.success(`Precificação ativada com sucesso.`);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const handleEdit = (pricing: PricingHistory) => {
    handleClose();
    navigate(`/precificacao/${pricing.id}/edit`, { replace: true });
  };

  const handleDuplicate = (pricing: PricingHistory) => {
    handleClose();
    navigate(`/precificacao/${pricing.id}/duplicate`, { replace: true });
  };

  const handleButtonClick = (to: string) => {
    setTimeout(() => {
      navigate(to, { replace: true });
    }, 0);
  };

  const handleToggleRow = (id: string) => {
    setOpenRowId(prev => (prev === id ? null : id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'gray';
      case 'expired':
        return 'red';
      case 'scheduled':
        return 'orange';
      case 'pending_approval':
        return 'blue';
      default:
        return 'black';
    }
  };


  const tableLabel = ['Status', 'descrição', 'Código Linha', 'Origem', 'Destino', 'Datas Previstas', 'Opções']
  return (
    <RootLayout>
      <div className="pricinglist" id="PricingList">
        <Typography id="PricingList_title" variant="subtitle1">
          Precificação
        </Typography>
        <Container style={{ marginTop: "20px" }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', mb: '2em' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'end', alignItems: 'center' }}>
              <Button
                id={`PricingList_button_add`}
                variant="contained"
                color="primary"
                startIcon={<AddCircleIcon />}
                onClick={() => handleButtonClick(Routes.precificacao.create)}
                sx={{ width: { xs: '50%', sm: '30%' } }}
              >
                Nova Precificação
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', mt: '2em', alignItems: 'center' }}>
              <Typography id={`PricingList_subtitle`} variant="subtitle2">Históricos</Typography>
              <Search id={`PricingList_search`} placeholder="Pesquisar" />

            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', mt: '2em', alignItems: 'center' }}>

              <FormControl sx={{ minWidth: 200 }} size="small">
                <Typography id={`PricingList_filter_label`} variant="body1" sx={{ marginBottom: "4px" }}>
                  Filtrar por Status
                </Typography>
                <Select
                  labelId="PricingList_filter_status"
                  id="PricingList_filter_status"
                  value={statusFilter || ''}
                  onChange={(e) => setStatusFilter(e.target.value || null)}
                >
                  <MenuItem value="all">Todas Precificações</MenuItem>
                  <MenuItem value={PricingStatus.PENDING_APPROVAL}>Aguardando Aprovação</MenuItem>
                  <MenuItem value={PricingStatus.SCHEDULED}>Aguardando Ativação</MenuItem>
                  <MenuItem value={PricingStatus.ACTIVE}>Ativas</MenuItem>
                  <MenuItem value={PricingStatus.INACTIVE}>Inativas</MenuItem>
                  <MenuItem value={PricingStatus.EXPIRED}>Expiradas</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          {isLoading ? (
            <PageLoader />
          ) :
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {tableLabel.map((item: string, index: number) => (
                      <TableCell id={`PricingList_label_${index}`} key={index}><strong>{item}</strong></TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody sx={{ mt: '2em', alignItems: 'right', whiteSpace: 'nowrap' }}>
                  {
                    filteredData.map((pricingHistory: PricingHistory, index: number) => {

                      const isOpen = openRowId === pricingHistory.id;
                      return (
                        <React.Fragment key={index}>
                          <TableRow hover onClick={() => handleToggleRow(pricingHistory.id)}>
                            <TableCell id={`PricingList_status_${index}`}>
                              <Box
                                component="span"
                                sx={{
                                  display: 'inline-block',
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  backgroundColor: getStatusColor(pricingHistory.status),
                                }}
                                title={pricingHistory.statusText}
                              />
                            </TableCell>

                            <TableCell id={`PricingList_description_${index}`}>{pricingHistory.description}</TableCell>
                            <TableCell id={`PricingList_lineCode_${index}`}>{pricingHistory.line.line_code}</TableCell>
                            <TableCell id={`PricingList_origin_${index}`}>{pricingHistory.origin}</TableCell>
                            <TableCell id={`PricingList_destiny_${index}`}>{pricingHistory.destiny}</TableCell>
                            <TableCell id={`PricingList_forecast_${index}`}>{pricingHistory.forecastDateFormat.map((date: string) => dayjs(date).format('DD-MM-YYYY'))
                              .join(' | ')}</TableCell>
                            <TableCell id={`PricingList_action_${index}`}>
                              <IconButton
                                id={`UserListScreen_button_more`}
                                aria-controls={open ? 'action-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAnchorEl(e.currentTarget);
                                  setSelectedHistory(pricingHistory);
                                }}
                              >
                                <MoreVertIcon color="success" />
                              </IconButton>

                              <Menu
                                id="PricingList_action-menu"
                                anchorEl={anchorEl}
                                open={open && selectedHistory?.id === pricingHistory.id}
                                onClose={handleClose}
                                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                                transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                              >
                                <MenuItem id={`PricingList_button_edit_${index}`} onClick={() => handleEdit(pricingHistory)}>
                                  <EditIcon fontSize="small" color="primary" sx={{ marginRight: 1 }} />
                                  Editar
                                </MenuItem>
                                <MenuItem id={`PricingList_button_duplicate_${index}`} onClick={() => handleDuplicate(pricingHistory)}>
                                  <ContentCopyIcon fontSize="small" color="primary" sx={{ marginRight: 1 }} />
                                  Duplicar
                                </MenuItem>
                                {statusTransitions[pricingHistory.status] && (
                                  <MenuItem id={`PricingList_button_${pricingHistory.status}_${index}`} onClick={() => handleStatusChange(pricingHistory)}>
                                    {React.cloneElement(
                                      statusTransitions[pricingHistory.status].icon,
                                      { color: statusTransitions[pricingHistory.status].color }
                                    )}
                                    {statusTransitions[pricingHistory.status].label}
                                  </MenuItem>
                                )}

                                <MenuItem id={`PricingList_button_remove_${index}`} onClick={() => handleRemove(pricingHistory)}>
                                  <DeleteIcon fontSize="small" color="error" sx={{ marginRight: 1 }} />
                                  Remover
                                </MenuItem>
                                {pricingHistory.status === PricingStatus.SCHEDULED && (
                                  <MenuItem id={`PricingList_button_active_${index}`} onClick={() => handleActiveManual(pricingHistory)}>
                                    <TouchAppIcon color="success" fontSize="small" sx={{ marginRight: 1 }} />
                                    Ativação Manual
                                  </MenuItem>
                                )}
                              </Menu>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell colSpan={7} sx={{ paddingBottom: 0, paddingTop: 0 }}>
                              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                                <Box margin={2}>
                                  <Typography id={`PricingList_details_${index}`} variant="subtitle2" gutterBottom>Detalhes:</Typography>
                                  <Box sx={{
                                    display: "flex",
                                    justifyContent: 'space-between',
                                    width: '100%', marginBottom: '1em'
                                  }}>
                                    <Grid2 container spacing={2} alignItems="left">

                                      <Grid2>
                                        <Box id={`PricingList_pricingCode_${index}`} textAlign="left" fontSize={12} color="#2C2D33" sx={{ display: 'grid' }}>
                                          Codigo da Precificação
                                          <Chip id={`${index}_category`} label={pricingHistory.pricing_code} size="small" sx={{ mt: 0.5, backgroundColor: '#f1f1f1', color: '#6E7079', borderRadius: '5px', fontSize: '14px' }} />
                                        </Box>
                                      </Grid2>

                                      <Grid2  >
                                        <Box id={`PricingList_line_${index}`} textAlign="left" fontSize={12} color="#2C2D33" sx={{ display: 'grid' }}>
                                          Descrição da Linha
                                          <Chip id={`${index}_time`} label={pricingHistory.line.description} size="small" sx={{ mt: 0.5, backgroundColor: '#f1f1f1', color: '#6E7079', borderRadius: '5px', fontSize: '14px' }} />
                                        </Box>
                                      </Grid2>
                                      <Grid2  >
                                        <Box id={`PricingList_statusDescription_${index}`} textAlign="left" fontSize={12} color="#2C2D33" sx={{ display: 'grid' }}>
                                          Descrição do Status de precificação
                                          <Chip id={`${index}_date`} label={pricingHistory.statusText} size="small" sx={{ mt: 0.5, backgroundColor: '#f1f1f1', color: '#004923', borderRadius: '5px', fontSize: '16px' }} />
                                        </Box>
                                      </Grid2>
                                      <Grid2  >
                                        <Box id={`PricingList_activationDate_${index}`} textAlign="left" fontSize={12} color="#2C2D33" sx={{ display: 'grid' }}>
                                          Data de Ativação
                                          <Chip id={`${index}_date`} label={dayjs(pricingHistory.activationDate).format('DD-MM-YYYY')} size="small" sx={{ mt: 0.5, backgroundColor: '#f1f1f1', color: '#004923', borderRadius: '5px', fontSize: '14px' }} />
                                        </Box>
                                      </Grid2>
                                      <Grid2  >
                                        <Box id={`PricingList_expiresAt_${index}`} textAlign="left" fontSize={12} color="#2C2D33" sx={{ display: 'grid' }}>
                                          Data de Expiração
                                          <Chip id={`${index}_date`} label={dayjs(pricingHistory.expiresAt).format('DD-MM-YYYY')} size="small" sx={{ mt: 0.5, backgroundColor: '#f1f1f1', color: '#004923', borderRadius: '5px', fontSize: '14px' }} />
                                        </Box>
                                      </Grid2>
                                      <Grid2  >
                                        <Box id={`PricingList_timePurchase_${index}`} textAlign="left" fontSize={12} color="#2C2D33" sx={{ display: 'grid' }}>
                                          Horários para compra
                                          <Chip id={`${index}_date`} label={pricingHistory.timePurchase
                                            .map((times: { value: string, description: string, start: number, end: number }) => times.description)
                                            .join(' | ')} size="small" sx={{ mt: 0.5, backgroundColor: '#f1f1f1', color: '#6E7079', borderRadius: '5px', fontSize: '14px' }} />
                                        </Box>
                                      </Grid2>
                                      <Grid2  >
                                        <Box id={`PricingList_datePurchase_${index}`} textAlign="left" fontSize={12} color="#2C2D33" sx={{ display: 'grid' }}>
                                          Datas permitidas para compra
                                          <Chip id={`${index}_date`} label={pricingHistory.purchaseDatesFormat
                                            .map((date: string) => dayjs(date).format('DD-MM-YYYY'))
                                            .join(' | ')} size="small" sx={{ mt: 0.5, backgroundColor: '#f1f1f1', color: '#6E7079', borderRadius: '5px', fontSize: '14px' }} />
                                        </Box>
                                      </Grid2>
                                    </Grid2>
                                  </Box>
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </React.Fragment>
                      )
                    })}
                </TableBody>
              </Table>
            </TableContainer>}
        </Container>
      </div>
    </RootLayout>
  );
}
