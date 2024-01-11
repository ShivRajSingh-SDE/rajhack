import "./App.css";

import HomePage from "./HomePages/HomePage";
import Header from "./HomePages/header";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Form from "./Pages/Form";
import SeeReport from "./Pages/SeeReport";
import dashboard from "./Pages/dashboard";
import Login from "./Auth/Login";
import Reg from "./Auth/Reg";
import Forgot from "./Auth/Forgot";
import Aware from "./Aware/Aware";
import Dummy from "./Aware/Dummy";

function App() {
  return (
    <div className="App">
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/report" element={<SeeReport />} />
        <Route path="/dash" element={<dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Reg />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/awareness" element={<Aware />} />
        <Route path="/dummy" element={<Dummy />} />
      </Routes>
    </div>
  );
}

export default App;
