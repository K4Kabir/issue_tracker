import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import jwtAxios from "../../libs/jwtAxios/jwtAxios";

const Home = () => {
  const [projects, setProjects] = useState([
    {
      name: "Test Project",
      image:
        "https://images.pexels.com/photos/5852610/pexels-photo-5852610.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      name: "Test Project",
      image:
        "https://images.pexels.com/photos/5852610/pexels-photo-5852610.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
  ]);

  useEffect(() => {
    const getProjects = async function () {
      try {
        let response = await jwtAxios.get(`/Project/getAssingedProjects`);
        if (response.data.success) {
          setProjects(response.data.message);
        } else {
          return;
          setProjects([]);
        }
      } catch (error) {
        return;
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
                <Card key={index} sx={{ maxWidth: 345 }}>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="140"
                      image={el.image}
                      alt="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {el.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Lizards are a widespread group of squamate reptiles,
                        with over 6,000 species, ranging across all continents
                        except Antarctica
                      </Typography>
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
