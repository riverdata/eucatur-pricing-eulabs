import { useState, FC, ReactNode, SyntheticEvent } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { FieldErrors, UseFormRegister, UseFormTrigger, useFormContext } from "react-hook-form";
import { toast } from "react-toastify";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
  id: string;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, id, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`${id}_${index}`}
      aria-labelledby={`${id}_${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2, pb: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(id: string) {
  return {
    id: `${id}`,
    'aria-controls': `${id}`,
  };
}

interface CustomTabPanelsProps {
  id: string;
  tabs: {
    label: string;
    content: ReactNode
  }[];
  initialValue?: number;
  trigger?: UseFormTrigger<any>;
  register?: UseFormRegister<any>;
  errors?: FieldErrors<any>;
  disabled?: boolean;
}

const CustomTabPanels: FC<CustomTabPanelsProps> = ({ id, tabs, initialValue = 0, trigger, disabled = false }) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = async (_event: SyntheticEvent, newValue: number) => {
    const isValid = await trigger();
    if (!isValid) {
      toast.error("Por favor, corrija os erros antes de avançar.");
      return;
    }
    if (isValid) {
      setValue(newValue);
    }

  };
  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="CustomTabPanels" variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile>
          {tabs?.map((tab, index) => (
            disabled ? <Tab key={index} label={tab.label} {...a11yProps(`CustomTabPanels_${id}_button_${index}`)} sx={{ p: 1, textTransform: 'capitalize' }} disabled={index > value + 1} />
              :
              <Tab key={index} label={tab.label} {...a11yProps(`CustomTabPanels_${id}_button_${index}`)} sx={{ p: 1, textTransform: 'capitalize' }} />
          ))}
        </Tabs>
      </Box>
      {tabs?.map((tab, index) => (
        <CustomTabPanel id={`CustomTabPanels_${id}_content`} key={index} value={value} index={index} >
          {tab.content}
        </CustomTabPanel>
      ))}
    </Box>
  );
}

export default CustomTabPanels;