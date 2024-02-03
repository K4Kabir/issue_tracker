import { Avatar, Box, Tooltip } from "@mui/material";
import { useContext } from "react";
import { User } from "../libs/context/UserContext";

const TotalOnline = () => {
  const { userOnline } = useContext(User);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        gap: "5px",
        mt: 3,
        mr: 3,
      }}
    >
      {userOnline.map((el, index) => {
        return (
          <>
            <Tooltip key={index} title={el}>
              <Avatar src="/static/images/avatar/1.jpg" />
            </Tooltip>
            <Box
              sx={{
                height: 7,
                width: 7,
                borderRadius: "50%",
                backgroundColor: "green",
              }}
            ></Box>
          </>
        );
      })}
    </Box>
  );
};

export default TotalOnline;
