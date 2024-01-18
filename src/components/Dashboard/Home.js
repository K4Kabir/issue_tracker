import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import jwtAxios from "../../libs/jwtAxios/jwtAxios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getProjects = async function () {
      try {
        let response = await jwtAxios.get(`/Project/getAssingedProjects`);
        if (response.data.success) {
          setProjects(response.data.message);
        } else {
          setProjects([]);
        }
      } catch (error) {
        setProjects([]);
      }
    };
    getProjects();
  }, []);

  return (
    <div>
      <Box sx={{ p: 10 }}>
        <Grid container spacing={2}>
          {projects.map((el, index) => {
            return (
              <Grid item xs={3}>
                <Card
                  onClick={() => navigate(`/project/${el.projectId}`)}
                  key={index}
                  sx={{ maxWidth: 345 }}
                >
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image={el.project.image}
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {el.project.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {el?.project.description}
                      </Typography>
                      <Chip
                        sx={{ mt: 3 }}
                        label={
                          (el?.project.issues.length || 0) +
                          " " +
                          "Issues Found"
                        }
                        color={
                          el?.project.issues.length == 0 ? "success" : "error"
                        }
                      />
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </div>
  );
};

export default Home;
