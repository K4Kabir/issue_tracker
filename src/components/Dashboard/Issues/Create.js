import {
  Autocomplete,
  Box,
  Button,
  Chip,
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

  const handleSave = async function (type) {
    let url = "";
    if (state.mode == "add") {
      url = "/Issue/createIssue";
    } else {
      url = "Issue/updateIssue";
    }
    let result = [];
    selected.map((el) => result.push(el.id));
    let formData = new FormData();
    if (state.mode == "add") {
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("projectId", state.projectId);
      formData.append("assignedUsers", JSON.stringify(result));
      formData.append("image", file);
    } else {
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("projectId", state.projectId);
      formData.append("assignedUsers", JSON.stringify(result));
      formData.append("image", file);
      formData.append("id", state.issueId);
    }
    let headers = {};
    if (file !== null && file !== undefined) {
      headers["content-type"] = file.type;
    }
    let response = await jwtAxios(url, {
      method: "POST",
      data: formData,
      headers: headers,
    });
    if (response.data.success) {
      toast.success(
        state.mode == "add"
          ? "Issue assinged successfully"
          : "Update Successfully"
      );
    } else {
      toast.error(response.data.message);
    }
  };

  const handleAction = async function (type) {
    let response = await jwtAxios.post("/Issue/changeStatus", {
      id: state.issueId,
      status: type,
    });
    if (response.data.success) {
      toast.success("Status Changed Successfully");
      getById();
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

  const getById = async function () {
    let response = await jwtAxios.post("/Issue/getIssueById", {
      id: state.issueId,
    });
    if (response.data.success) {
      setData(response.data.message);
      let temp = [];
      response.data.message.assignedUsers.map((el) => {
        temp.push({
          label: `${el.username}  (${el.role})`,
          id: el.id,
        });
        setSelected(temp);
        setFileUrl(response.data.message.image);
      });
    }
  };

  useEffect(() => {
    if (state.mode == "update" || state.mode == "view") {
      getById();
    }
  }, [state.mode]);

  console.log(file, "FILEs");

  return (
    <Box sx={{ p: 8 }}>
      <Paper sx={{ p: 3 }} elevation={3}>
        {state.mode != "add" && (
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Chip
              label={data.status}
              color={
                data.status == "PENDING"
                  ? "error"
                  : data.status == "REOPENED"
                  ? "warning"
                  : "primary"
              }
            />
          </Box>
        )}
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
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => handleInput(e)}
              fullWidth
              type="text"
              value={data.title}
              label="Title"
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              InputLabelProps={{
                shrink: true,
              }}
              name="description"
              onChange={(e) => handleInput(e)}
              fullWidth
              type="textarea"
              value={data.description}
              label="Description"
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <TextField
              InputLabelProps={{
                shrink: true,
              }}
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
            {fileUrl && (
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
            )}
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
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  placeholder="Assinged to"
                />
              )}
            />
          </Box>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "center",
              gap: "5px",
            }}
          >
            <Button onClick={handleSave} variant="contained">
              {state.mode == "add"
                ? "Save"
                : state.mode == "update"
                ? "Update"
                : ""}
            </Button>
            {state.mode !== "add" && (
              <>
                <Button
                  onClick={() => handleAction("CLOSED")}
                  color="success"
                  variant="outlined"
                >
                  Mark As Close
                </Button>
                {}
                <Button
                  onClick={() => handleAction("REOPENED")}
                  color="warning"
                  variant="outlined"
                >
                  Mark As Reopen
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Create;
