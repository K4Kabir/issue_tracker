import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ReplayIcon from "@mui/icons-material/Replay";
import { useEffect, useState } from "react";

const Filter = ({ data, filterData }) => {
  const [formData, setFormData] = useState({});
  const handleInput = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  useEffect(() => {
    filterData(formData);
  }, [formData]);
  return (
    <Paper
      sx={{ p: 3, mb: 2, display: "flex", gap: "10px", alignItems: "center" }}
      elevation={3}
    >
      {data.map((el, index) => {
        return (
          <>
            {el.type == "text" ? (
              <Box key={index}>
                <TextField
                  onChange={(e) => handleInput(e)}
                  size="small"
                  type={el.type}
                  name={el.name}
                  label={el.title}
                  value={formData[el.name] || ""}
                />
              </Box>
            ) : el.type == "select" ? (
              <FormControl
                onChange={(e) => alert(e.target.value)}
                sx={{ m: 1, minWidth: 120 }}
                size="small"
              >
                <InputLabel id="demo-select-small-label">{el.title}</InputLabel>
                <Select
                  size="small"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  name={el.name}
                  value={formData[el.name] || ""}
                  label={el.title}
                  onChange={(e) => handleInput(e)}
                >
                  <MenuItem value={""}>Select</MenuItem>
                  {el?.options.map((s, index) => {
                    return (
                      <MenuItem key={index} value={s.value}>
                        {s.title}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            ) : (
              "No Input is defined for the given value"
            )}
          </>
        );
      })}

      <Button variant="contained">
        <SearchIcon />
      </Button>
      <Button onClick={() => setFormData({})} variant="contained">
        <ReplayIcon />
      </Button>
    </Paper>
  );
};

export default Filter;
