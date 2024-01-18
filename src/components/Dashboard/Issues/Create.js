import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";

const Create = () => {
  const { state } = useLocation();
  return <Box>Create {state.mode}</Box>;
};

export default Create;
