import { Box, IconButton } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useContext } from "react";
import { User } from "../libs/context/UserContext";

const ThemeButton = () => {
  const { dark, setDark } = useContext(User);
  return (
    <>
      <IconButton
        sx={{ ml: 1 }}
        onClick={() => setDark((prev) => !prev)}
        color="inherit"
      >
        {dark ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </>
  );
};

export default ThemeButton;
