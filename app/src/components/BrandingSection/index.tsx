import {
  Box,
  Grid2
} from '@mui/material';

import logo from '@assets/images/logo_eucatur_branca.svg';
import "./BrandingSection.scss";

export default function BrandingSection() {
  return (
    <Grid2 size={{ sm: 12, md: 7 }} id="BrandingSection" className="brandingsection" sx={{ height: { xs: '0', md: '100%' } }}>
      <Box
        my={4}>
           <img
            src={logo}
            className="brandingsection__image"
            alt="Eucatur"
            id="BrandingSection_image"
          />
      </Box>
    </Grid2>
  );
}
