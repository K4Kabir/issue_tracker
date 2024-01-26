import { useContext } from "react";
import { User } from "../libs/context/UserContext";
import { Avatar, Box, Button, Link } from "@mui/material";
import ThemeButton from "./ThemeButton";

const Navbar = () => {
  const { user, Logout } = useContext(User);

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "grey",
        justifyContent: "space-between",
        alignItems: "center",
        height: "50px",
      }}
    >
      <Box sx={{ ml: 3, color: "white", fontWeight: 700 }}>
        WELCOME {user?.username.toUpperCase()}
      </Box>
      <Box sx={{ mr: 3, display: "flex", alignItems: "center", gap: "30px" }}>
        <Link href="/projectManagement">Project Management</Link>
        <Button variant="contained" onClick={Logout}>
          Logout
        </Button>
        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
        <ThemeButton />
      </Box>
    </Box>
  );
};

export default Navbar;
