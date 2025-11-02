import { Box, Typography, LinearProgress, linearProgressClasses, styled } from "@mui/material";
import { themeScss } from "@theme";

interface ProgressBarProps {
  id: string;
  value: number;
  label?: string;
}

const CustomLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[300],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: themeScss.color.primary,
    transition: 'transform 0.4s ease-in-out, width 0.4s ease-in-out',
  },
}));

const ProgressBar: React.FC<ProgressBarProps> = ({ id, value, label }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        {label && (
          <Typography id={`${id}-label`} variant="body2" sx={{ mb: 0.5 }}>{label}</Typography>
        )}
        <CustomLinearProgress variant="determinate" value={value} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography id={`${id}-progress`} variant="body2" color="text.secondary">
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProgressBar;
