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
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jwtAxios from "../../../libs/jwtAxios/jwtAxios";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";

const Issues = () => {
  const [page, setPage] = useState(0);
  const [perPage, setperPage] = useState(10);
  const [projectName, setProjectName] = useState({ name: "", description: "" });
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setperPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    const getAllIssues = async () => {
      let response = await jwtAxios.post("/Issue/getIssueByProjectId", {
        projectId: parseInt(projectId),
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

    getAllIssues();
  }, []);

  return (
    <Box>
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
          <Typography color={"#000000de"} variant="h4" gutterBottom>
            {projectName.name} {"-"} {projectName.description}
          </Typography>
        </Box>
        <TableContainer
          sx={{ border: "1px solid black", borderRadius: "20px" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {issues
                ?.slice(page * perPage, page * perPage + perPage)
                .map((el, index) => {
                  return (
                    <TableRow key={index}>
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
                          color={el.status === "PENDING" ? "error" : "success"}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <IconButton>
                            <DeleteTwoToneIcon />
                          </IconButton>
                          <IconButton>
                            <VisibilityTwoToneIcon />
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
