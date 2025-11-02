import { useState, useEffect, FC } from "react";
import dayjs, { Dayjs } from "dayjs";
import { themeScss } from "@theme";
import { Card, CardContent, Typography, IconButton, Box, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./CustomFrequencies.scss";
import CreateOrUpdateModal from "./CreateOrUpdate";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Grid from '@mui/material/Grid2';
import isBetween from "dayjs/plugin/isBetween";
import { toast } from "react-toastify";
dayjs.extend(isBetween);

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
    status?: string;
}

const updateStatus = (purchaseDates: IFrequency[]) => {
    const now = dayjs().startOf('day');
    const parsedPurchaseDates = purchaseDates.map((period: any) => {
        const startDate = dayjs.isDayjs(period.startDate) ? period.startDate : dayjs(period.startDate);
        const endDate = dayjs.isDayjs(period.endDate) ? period.endDate : dayjs(period.endDate);

        const isActive = now.isBetween(startDate.startOf('day'), endDate.endOf('day'), null, '[]');
        return {
            ...period,
            startDate,
            endDate,
            status: isActive ? 'Em produção' : 'Inativa'
        };
    });

    return parsedPurchaseDates;
};


interface CustomFrequenciesProps {
    dataFrequency?: IFrequency[];
    status?: boolean;
    handleUpdateForm: (updatedData: IFrequency[]) => void;
    datasLiberadas?: Dayjs[];
}

const CustomFrequencies: FC<CustomFrequenciesProps> = ({
    dataFrequency = [],
    status = true,
    handleUpdateForm,
    datasLiberadas = []
}) => {

    const [data, setData] = useState<IFrequency[]>([]);
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const [selectedData, setSelectedData] = useState<IFrequency>();


    useEffect(() => {
        const purchaseDates = updateStatus(dataFrequency);
        if (purchaseDates.length === 0) {
            return;
        } else {
            setData(purchaseDates);
            handleUpdateForm(purchaseDates);
        }

    }, []);

    const daysOfWeek: ISelectDay[] = [
        { id: '0', name: "Seg", description: "Segunda-feira" },
        { id: '1', name: "Ter", description: "Terça-feira" },
        { id: '2', name: "Qua", description: "Quarta-feira" },
        { id: '3', name: "Qui", description: "Quinta-feira" },
        { id: '4', name: "Sex", description: "Sexta-feira" },
        { id: '5', name: "Sab", description: "Sábado" },
        { id: '6', name: "Dom", description: "Domingo" },
    ];

    const handleRemove = async (value: IFrequency) => {
        let updateData = data.filter((item) =>
            item.id !== value.id
        )

        setData(updateData)
        handleUpdateForm(updateData);
    };

    const handleUpdate = async (newValue: IFrequency) => {
        setSelectedData(newValue);
        setShowCreateModal(true);
    };

    const handleAddOrUpdate = async (newValue: IFrequency) => {
        let updateData = []
        if (newValue.id) {
            updateData = data.map((item) =>
                item.id === newValue.id ? newValue : item
            )
        } else {
            const newId = `${data.length}`;
            newValue.id = newId;
            updateData = [...data, newValue];
        }

        const purchaseDates = updateStatus(updateData);
        setData(purchaseDates);
        handleUpdateForm(purchaseDates);
    };



    return (
        <Box id="CustomFrequencies" className="customfrequencies">
            <Grid container spacing={2}>
                {data.map((item, index) => (
                    <Grid
                        size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                        key={index}>
                        <Card className="customfrequencies__container">
                            <CardContent>
                                {status &&
                                    <div className="status">
                                        <span className={`status-indicator ${item.status === 'Inativa' ? 'inactive' : 'active'}`}></span>
                                        <Typography id={`CustomFrequencies_description_${index}`} >{item.status}</Typography>
                                    </div>
                                }
                                <div className="days">
                                    {daysOfWeek.map((day) => (
                                        <Typography
                                            id={`CustomFrequencies_days_${index}_${day.id}`}
                                            key={day.id}
                                            sx={{
                                                color: item.days.some((d) => d.name === day.name) ? themeScss.color.primary : themeScss.font.color
                                            }}
                                            className="days-button"
                                            variant="inherit"
                                        >
                                            {day.name}
                                        </Typography>
                                    ))}
                                </div>
                                <div className="date-range">
                                    <Typography variant="body2" id={`CustomFrequencies_daterange_${index}`}>{item.startDate.format("DD/MM/YYYY")} - {item.endDate.format("DD/MM/YYYY")}</Typography>
                                </div>
                                <div className="actions">
                                    <IconButton id={`CustomFrequencies_button_update_${index}`} onClick={() => handleUpdate(item)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" id={`CustomFrequencies_button_delete_${index}`} onClick={() => handleRemove(item)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
                <Button
                    id={`CustomFrequencies_button_create`}
                    onClick={() => setShowCreateModal(true)}
                    style={{
                        backgroundColor: themeScss.button.default.bgColor,
                        borderRadius: "50%",
                        minWidth: "50px",
                        height: "50px",
                    }}
                >
                    <AddRoundedIcon style={{ color: "white" }} />
                </Button>
            </Grid>

            <CreateOrUpdateModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onConfirm={handleAddOrUpdate}
                dataUpdate={selectedData!}
                datasLib={datasLiberadas}
            />

        </Box >
    );
};

export default CustomFrequencies;

