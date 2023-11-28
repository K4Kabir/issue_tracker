import { useContext } from "react";
import { User } from "../libs/context/UserContext";
import { Avatar, Box, Link } from "@mui/material";

const Navbar = () => {
  const { user } = useContext(User);

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
      <Box sx={{ ml: 3 }}>{user?.email}</Box>
      <Box sx={{ mr: 3, display: "flex", alignItems: "center" }}>
        <Link href="/projectManagement">Project Management</Link>
        <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
      </Box>
    </Box>
  );
};

export default Navbar;
