import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Home from "./components/Dashboard/Home";
import ProtectedRoute from "./libs/ProtectedRoute";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Register from "./components/Auth/Register";
import ProjectManagement from "./components/Dashboard/ProjectManagement";
import { useContext, useEffect } from "react";
import { User } from "./libs/context/UserContext";
import Loader from "./components/Loader";
import Issues from "./components/Dashboard/Issues/Issues";
import Create from "./components/Dashboard/Issues/Create";
import { socket } from "./libs/jwtAxios/jwtAxios";
function App() {
  const { dark } = useContext(User);
  console.log(dark, "DARK");
  const darkTheme = createTheme({
    palette: {
      mode: dark ? "dark" : "light",
    },
  });

  useEffect(() => {
    socket.on("Userjoined", (user) => {
      console.log(user);
    });

    socket.on("Userdisconncted", (user) => {
      console.log(user);
    });
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Loader />
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route element={<Home />} path={"/"} exact />
            <Route
              element={<ProjectManagement />}
              path={"/projectManagement"}
              exact
            />
            <Route path="/project/:projectId" element={<Issues />} />
            <Route path="/createIssue" element={<Create />} />
          </Route>
          <Route element={<Login />} path={"/login"} exact />
          <Route element={<Register />} path={"/register"} exact />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
