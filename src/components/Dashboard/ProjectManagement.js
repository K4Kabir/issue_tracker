import { Autocomplete, Box, Button, Modal, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import jwtAxios from "../../libs/jwtAxios/jwtAxios";
import { toast } from "sonner";
import SmartTable from "../../@smart-table";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ProjectManagement = () => {
  const tableTemplate = {
    columns: [
      {
        field: "name",
        title: "Project Name",
      },
      {
        field: "description",
        title: "Project description",
      },
      {
        title: "Project Image",
        render: (rowData) => (
          <img
            objectFit="contain"
            src={
              rowData.image ||
              "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
            }
            style={{ width: 50, borderRadius: "50%" }}
          />
        ),
      },
    ],
  };

  const [open, setOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFile(null);
    setImg(null);
  };
  const [data, setData] = useState({});
  const [selected, setSelected] = useState([]);
  const [file, setFile] = useState(null);
  const [img, setImg] = useState(null);
  const [tableData, setTableData] = useState([]);

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    const userArray = [];

    selected.forEach((el) => {
      userArray.push({ userId: el.id });
    });

    let formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("assign", JSON.stringify(userArray));
    formData.append("password", data.password);
    formData.append("image", file);
    let response = await jwtAxios("/Project/save", {
      method: "POST",
      data: formData,
      headers: {
        "content-type": file.type,
      },
    });
    if (response.data.success) {
      toast.success("Project Created Successfully");
      getAll();
    } else {
      toast.error(response.data.message);
    }
    setData({});
    handleClose();
  };

  const handleClickEdit = async (data) => {
    setData(data);
    setImg(data.image);
    handleOpen();
  };

  const handleDelete = async (data) => {
    let response = await jwtAxios.post("/Project/deleteProject", {
      id: data.id,
    });
    if (response.data.success) {
      toast.success(response.data.message);
      getAll();
    } else {
      toast.error(response.data.message);
    }
  };

  const getAll = function () {
    jwtAxios
      .get("/Project/getAll")
      .then((res) => {
        if (res.data.success) {
          setTableData(res.data.message);
        } else {
          setTableData([]);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  useEffect(() => {
    const getUsers = async () => {
      let response = await jwtAxios.post("/User/getAllUsers");
      if (response.data.success) {
        let temp = [];
        response.data.message.map((el) => {
          temp.push({ label: `${el.username}  (${el.role})`, id: el.id });
          setAllUsers(temp);
        });
      } else {
        setAllUsers([]);
      }
    };

    getUsers();
    getAll();
  }, []);

  return (
    <Box sx={{ p: 5 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" onClick={handleOpen}>
          Create Project
        </Button>
      </Box>
      <SmartTable
        components={{
          Toolbar: () => (
            <>
              <div
                style={{
                  height: "0px",
                }}
              ></div>
            </>
          ),
        }}
        title="Onboard Tenants List"
        columns={tableTemplate.columns}
        data={tableData || []}
        options={{
          search: false,
          showTitle: false,
          actionsColumnIndex: -1,
          headerStyle: { position: "sticky", top: 0 },
        }}
        actions={[
          {
            icon: () => <EditOutlinedIcon color="primary" />,
            tooltip: "Edit",
            onClick: (event, rowData) => handleClickEdit(rowData),
          },
          {
            icon: () => <VisibilityIcon color="primary" />,
            tooltip: "View",
            onClick: (event, rowData) => console.log(rowData),
          },
          {
            icon: () => <DeleteOutlineOutlinedIcon color="primary" />,
            tooltip: "Delete",
            onClick: (event, rowData) => handleDelete(rowData),
          },
        ]}
        localization={{
          body: {
            emptyDataSourceMessage: "No records to display",
            filterRow: {
              filterTooltip: "Filter",
              filterPlaceHolder: "Filtaaer",
            },
          },
        }}
        style={{
          borderRadius: 16,
          boxShadow: "0px 10px 10px 4px rgb(0 0 0 / 4%)",
        }}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box sx={{ mt: 3 }}>
              <TextField
                name="name"
                onChange={(e) => handleInput(e)}
                fullWidth
                type="text"
                label="Project Name"
                value={data.name}
              />
            </Box>
            <Box sx={{ mt: 3 }}>
              <TextField
                name="description"
                onChange={(e) => handleInput(e)}
                fullWidth
                type="text"
                label="Project Description"
                value={data.description}
              />
            </Box>
            <Box sx={{ mt: 3 }}>
              <TextField
                name="password"
                onChange={(e) => handleInput(e)}
                fullWidth
                type="password"
                label="Password for the project"
                value={data.password}
              />
            </Box>
            <Box sx={{ display: "flex", mt: 3 }}>
              <input
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  setImg(URL.createObjectURL(e.target.files[0]));
                }}
                name="image"
                type="file"
                label="Project Description"
              />
              <img
                width={100}
                height={100}
                style={{ borderRadius: "50%", objectFit: "contain" }}
                src={
                  img ||
                  "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
                }
              />
            </Box>
            <Box sx={{ mt: 3 }}>
              <Autocomplete
                name="assign"
                onChange={(e, val) => {
                  setSelected(val);
                }}
                multiple
                id="tags-standard"
                options={allUsers}
                value={selected}
                //getOptionLabel={(option) => option.title}
                // defaultValue={[top100Films[13]]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    placeholder="Assinged to"
                  />
                )}
              />
            </Box>
            <Box sx={{ mt: 3 }}>
              <Button onClick={handleSubmit} variant="contained">
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProjectManagement;
