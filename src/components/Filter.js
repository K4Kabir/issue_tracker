import { Box, Button, Paper, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ReplayIcon from "@mui/icons-material/Replay";
import { useState } from "react";

const Filter = ({ data, filterData }) => {
  const [formData, setFormData] = useState({});
  const handleInput = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    setFormData({
      ...formData,
      [name]: value,
    });
    filterData(formData);
  };
  return (
    <Paper
      sx={{ p: 3, m: 2, display: "flex", gap: "10px", alignItems: "center" }}
      elevation={3}
    >
      {data.map((el, index) => {
        return (
          <>
            <Box key={index}>
              <TextField
                onChange={(e) => handleInput(e)}
                size="small"
                type={el.type}
                name={el.name}
                label={el.title}
              />
            </Box>
          </>
        );
      })}

      <Button variant="contained">
        <SearchIcon />
      </Button>
      <Button variant="contained">
        <ReplayIcon />
      </Button>
    </Paper>
  );
};

export default Filter;
