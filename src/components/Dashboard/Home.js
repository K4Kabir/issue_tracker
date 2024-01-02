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
import React, { useContext } from "react";
import { User } from "../../libs/context/UserContext";
import { useState } from "react";
import { useEffect } from "react";
import jwtAxios from "../../libs/jwtAxios/jwtAxios";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const { Logout } = useContext(User);

  useEffect(() => {
    const getProjects = async function () {
      let response = await jwtAxios.get(`/Project/getAssingedProjects`);
      if (response.data.success) {
        setProjects(response.data.message);
      } else {
        setProjects([]);
      }
    };
    getProjects();
  }, []);

  return (
    <div>
      Home
      <Button onClick={Logout} variant="contained">
        Logout
      </Button>
      <Box sx={{ p: 10  }}>
        <Grid container spacing={2}>
          {projects.map((el, index) => {
            return (
              <Grid item xs={4}>
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
