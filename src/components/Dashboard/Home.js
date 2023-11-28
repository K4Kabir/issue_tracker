import { Button } from "@mui/material";
import React, { useContext } from "react";
import { User } from "../../libs/context/UserContext";

const Home = () => {
  const { Logout } = useContext(User);
  return (
    <div>
      Home
      <Button onClick={Logout} variant="contained">
        Logout
      </Button>
    </div>
  );
};

export default Home;
