import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import jwtAxios from "../../../libs/jwtAxios/jwtAxios";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "sonner";

const Create = () => {
  const { state } = useLocation();
  const [selected, setSelected] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [data, setData] = useState({});

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setData({
      ...data,
      [name]: value,
    });
  };

  const clerFiles = () => {
    setFile(null);
    setFileUrl("");
  };

  const handleSave = async function () {
    let result = [];
    selected.map((el) => result.push(el.id));
    let formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("projectId", state.projectId);
    formData.append("assignedUsers", JSON.stringify(result));
    formData.append("image", file);
    let response = await jwtAxios.post("/Issue/createIssue", formData);
    if (response.data.success) {
      toast.success("Issue assinged successfully");
    } else {
      toast.error(response.data.message);
    }
  };

  useEffect(() => {
    const getAllUsers = function () {
      jwtAxios
        .post("/Issue/getAllUserForIssue", { projectId: state.projectId })
        .then((res) => {
          if (res.data.success) {
            let temp = [];
            res.data.message.members.map((el) => {
              temp.push({
                label: `${el.user.username}  (${el.user.role})`,
                id: el.user.id,
              });
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
            {state.mode === "add"
              ? "Create"
              : state.mode === "view"
              ? "View"
              : "Edit"}{" "}
            Issue
          </Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              name="title"
              onChange={(e) => handleInput(e)}
              fullWidth
              type="text"
              label="Title"
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              name="description"
              onChange={(e) => handleInput(e)}
              fullWidth
              type="textarea"
              label="Description"
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              disabled
              name="projectId"
              onChange={(e) => handleInput(e)}
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
            <TextField
              onChange={(e) => {
                setFile(e.target.files[0]);
                setFileUrl(URL.createObjectURL(e.target.files[0]));
              }}
              sx={{ width: "50%" }}
              type="file"
            />
            <Box
              sx={{
                position: "relative",
                width: "200px",
                height: "200px",
                border: "1px solid black",
                borderRadius: "50%",
                mr: "15%",
              }}
            >
              {fileUrl && (
                <IconButton
                  onClick={clerFiles}
                  sx={{ position: "absolute", right: -30 }}
                >
                  <CloseIcon />
                </IconButton>
              )}
              <img
                width={200}
                height={200}
                style={{ objectFit: "fill", borderRadius: "50%" }}
                src={fileUrl}
              />
            </Box>
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
          <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
            <Button onClick={handleSave} variant="contained">
              Save
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Create;
