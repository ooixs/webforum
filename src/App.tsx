import React from "react";
import "./App.css";
import TopicItem from "./components/TopicItem";
import PostItem from "./components/PostItem";
import ReplyItem from "./components/ReplyItem";
import Login from "./pages/Login";
import PostPage from "./pages/PostPage";
import Register from "./pages/Register";
import ReplyPage from "./pages/ReplyPage";
import TopicPage from "./pages/TopicPage";
import { BrowserRouter, Route, Routes} from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { blue, orange } from "@mui/material/colors";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/topics" element={<TopicPage />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
