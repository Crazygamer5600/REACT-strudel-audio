import React from "react";

export default function EditorPane({ value, onChange }) {
    return React.createElement(
        "div",
        { className: "col-md-8", style: { maxHeight: "50vh", overflowY: "auto" } },
        React.createElement("label", { htmlFor: "proc", className: "form-label" }, "Text to preprocess:"),
        React.createElement("textarea", {
            id: "proc",
            className: "form-control",
            rows: 15,
            value,
            onChange: (e) => onChange(e.target.value),
        })
    );
}
