import React from "react";

export default function Controls({ onProcess, onProcPlay, onPlay, onStop }) {
    return React.createElement(
        "div",
        { className: "col-md-4" },
        React.createElement(
            "nav",
            null,
            React.createElement("button", { onClick: onProcess, className: "btn btn-outline-primary" }, "Preprocess"),
            React.createElement("button", { onClick: onProcPlay, className: "btn btn-outline-primary" }, "Proc & Play"),
            React.createElement("br"),
            React.createElement("button", { onClick: onPlay, className: "btn btn-outline-primary" }, "Play"),
            React.createElement("button", { onClick: onStop, className: "btn btn-outline-primary" }, "Stop")
        )
    );
}
