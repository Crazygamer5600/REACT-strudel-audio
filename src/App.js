import React from "react";
import StrudelDemo from "./components/StrudelDemo";
import "./App.css";

export default function App() {
    return React.createElement("div", { className: "App" }, React.createElement(StrudelDemo));
}
