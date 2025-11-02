import { FC } from "react";
import { CircularProgress, Box } from "@mui/material";
import "./PageLoader.scss";
export interface PageLoaderProps {
  id?: string
}

const PageLoader: FC<PageLoaderProps> = ({ id = "PageLoader"}) => {
  return (
    <Box id={id} className="page-loader">
      <CircularProgress size={60} />
    </Box>
  );
};

export default PageLoader;