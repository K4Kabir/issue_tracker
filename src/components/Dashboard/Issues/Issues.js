import { Box, Button } from "@mui/material";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jwtAxios from "../../../libs/jwtAxios/jwtAxios";

const Issues = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getAllIssues = async () => {
      let response = await jwtAxios.post("/Issue/getIssueByProjectId", {
        projectId: parseInt(projectId),
      });
      console.log(response);
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
    </Box>
  );
};

export default Issues;
