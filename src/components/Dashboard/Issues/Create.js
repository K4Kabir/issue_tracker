import {
  Autocomplete,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import jwtAxios from "../../../libs/jwtAxios/jwtAxios";

const Create = () => {
  const { state } = useLocation();
  const [selected, setSelected] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const getAllUsers = function () {
      jwtAxios.post("/User/getAllUsers").then((res) => {
        if (res.data.success) {
          let temp = [];
          res.data.message.map((el) => {
            temp.push({ label: `${el.username}  (${el.role})`, id: el.id });
            setAllUsers(temp);
          });
        }
      });
    };
    getAllUsers();
  }, []);

  return (
    <Box sx={{ p: 8 }}>
      <Paper sx={{ p: 3 }} elevation={3}>
        <Box>
          <Typography sx={{ fontSize: "25px", fontWeight: 600 }}>
            {state.mode == "add"
              ? "Create"
              : state.mode == "view"
              ? "View"
              : "Edit"}{" "}
            Issue
          </Typography>
          <Box sx={{ mt: 2 }}>
            <TextField fullWidth type="text" label="Name" />
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField fullWidth type="textarea" label="Description" />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Autocomplete
              name="assign"
              onChange={(e, val) => {
                setSelected(val);
              }}
              multiple
              id="tags-standard"
              options={allUsers}
              value={selected}
              defaultValue={selected}
              //isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  placeholder="Assinged to"
                />
              )}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              disabled
              value={state.projectId}
              type="text"
              label="Project ID"
            />
          </Box>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <TextField sx={{ width: "50%" }} type="file" />
            <Box
              sx={{
                width: "200px",
                height: "200px",
                border: "1px solid black",
                borderRadius: "50%",
                mr: "15%",
              }}
            ></Box>
          </Box>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
            <Button variant="contained">Save</Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Create;
