import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Home from "./components/Dashboard/Home";
import ProtectedRoute from "./libs/ProtectedRoute";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Register from "./components/Auth/Register";
import ProjectManagement from "./components/Dashboard/ProjectManagement";
import { useContext, useState } from "react";
import UserContext, { User } from "./libs/context/UserContext";
import Loader from "./components/Loader";
import Issues from "./components/Dashboard/Issues/Issues";
import Create from "./components/Dashboard/Issues/Create";

function App() {
  const { dark } = useContext(User);
  console.log(typeof localStorage.getItem("theme"));
  const darkTheme = createTheme({
    palette: {
      mode: localStorage.getItem("theme") == "true" ? "dark" : "light",
    },
  });
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
