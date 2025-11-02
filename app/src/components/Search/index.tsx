import { FC } from "react";
import { OutlinedInput, FormControl } from "@mui/material";

import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { themeScss } from "@theme";

interface SearchProps {
  id: string;
  placeholder: string;
}

const Search: FC<SearchProps> = ({
  id,
  placeholder
}) => {

  return (
    <FormControl sx={{ width: "50%" }}>
      <OutlinedInput
        id={`${id}_input`}
        type="text"
        placeholder={placeholder}
        startAdornment={<SearchRoundedIcon />}
        sx={{
          color: themeScss.input.color,
          backgroundColor: themeScss.input.bgColor,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: themeScss.input.borderTranspartent,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: themeScss.input.borderColorFocus,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: themeScss.input.borderColorFocus,
          },
        }}
      />
    </FormControl>
  );
}

export default Search;