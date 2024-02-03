import {
  Box,
  Button,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jwtAxios from "../../../libs/jwtAxios/jwtAxios";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import DeleteModal from "../Modals/Delete";
import Filter from "../../Filter";
import { socket } from "../../../libs/jwtAxios/jwtAxios";

const Issues = () => {
  const [page, setPage] = useState(0);
  const [perPage, setperPage] = useState(10);
  const [projectName, setProjectName] = useState({ name: "", description: "" });
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [selection, setSelection] = useState([]);

  const getAllIssues = async (data) => {
    let response = await jwtAxios.post("/Issue/getIssueByProjectId", {
      projectId: parseInt(projectId),
      title: data?.title || "",
    });
    if (response.data.success) {
      setIssues(response.data.message.issues);
      setProjectName({
        name: response.data.message.name,
        description: response.data.message.description,
      });
    } else {
      setIssues([]);
    }
  };

  const filter = (data) => {
    console.log(data);
    getAllIssues(data);
  };

  useEffect(() => {
    socket.on("IssueDeleted", () => {
      getAllIssues();
    });
    socket.on("issueStatusChanged", () => {
      getAllIssues();
    });
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setperPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    getAllIssues();
  }, []);

  const handleDeleteIssue = (el) => {
    setId(el.id);
    setOpen(true);
  };

  return (
    <Box>
      <DeleteModal
        title={"Are you sure you want to Delete this Issue"}
        open={open}
        content={"You will not able to revert this!"}
        setOpen={setOpen}
        api={{ url: "/Issue/deleteIssue", data: id }}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end", m: 4 }}>
        <Button
          onClick={() =>
            navigate("/createIssue", {
              state: {
                mode: "add",
                projectId,
              },
            })
          }
          variant="contained"
        >
          Create New Issue
        </Button>
      </Box>
      <Box sx={{ p: 5 }}>
        <Box>
          <Typography variant="h5" sx={{ mb: 2, textDecoration: "underline" }}>
            {projectName.name} {"-"} {projectName.description}
          </Typography>
        </Box>
        <Box>
          <Filter
            data={[
              { name: "title", type: "text", title: "Title" },
              { name: "description", type: "text", title: "Description" },
              {
                name: "status",
                type: "select",
                title: "Status",
                options: [
                  { title: "Pending", value: "PENDING" },
                  { title: "Closed", value: "CLOSED" },
                  { title: "Reopened", value: "REOPENED" },
                  { title: "Resolved", value: "RESOLVED" },
                ],
              },
            ]}
            filterData={filter}
          />
        </Box>
        <TableContainer
          sx={{ border: "1px solid black", borderRadius: "20px" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <input
                    onClick={(e) => {
                      if (!e.target.checked) {
                        setSelection([]);
                      } else {
                        let tem = [];
                        issues.map((i) => {
                          tem.push(i.id);
                        });
                        setSelection(tem);
                      }
                    }}
                    type="checkbox"
                  />
                </TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assigned User</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {issues
                ?.slice(page * perPage, page * perPage + perPage)
                .map((el, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <input
                          onChange={(e) => {
                            if (selection.includes(el.id)) {
                              let temp = selection;
                              let result = temp.filter((f) => f !== el.id);
                              setSelection(result);
                            } else {
                              setSelection((prev) => [...prev, el.id]);
                            }
                          }}
                          checked={selection.includes(el.id)}
                          type="checkbox"
                        />
                      </TableCell>
                      <TableCell>{el.title}</TableCell>
                      <TableCell>{el.description}</TableCell>
                      <TableCell>
                        <img
                          width={30}
                          height={30}
                          alt="image"
                          src={el.image || "/Images/no.png"}
                        />
                      </TableCell>
                      <TableCell>{el.createdAt}</TableCell>
                      <TableCell>
                        <Chip
                          label={el.status}
                          color={
                            el.status === "PENDING"
                              ? "error"
                              : el.status == "REOPENED"
                              ? "warning"
                              : "success"
                          }
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {el.assignedUsers?.map((user, index) => {
                          return (
                            <Box sx={{ display: "flex", gap: "5px" }}>
                              <Chip
                                sx={{ m: 1 }}
                                key={index}
                                label={user.username}
                                color="primary"
                                variant="outlined"
                              />
                            </Box>
                          );
                        })}
                      </TableCell>
                      <TableCell>
                        <Box sx={{}}>
                          <IconButton
                            disabled={selection.length}
                            onClick={() => handleDeleteIssue(el)}
                          >
                            <DeleteTwoToneIcon />
                          </IconButton>
                          <IconButton disabled={selection.length}>
                            <VisibilityTwoToneIcon
                              onClick={() =>
                                navigate("/createIssue", {
                                  state: {
                                    mode: "update",
                                    projectId,
                                    issueId: el.id,
                                  },
                                })
                              }
                            />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={issues.length}
          rowsPerPage={perPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Box>
  );
};

export default Issues;
