import React from "react";

export default function EditorPane({ value, onChange }) {
    return React.createElement(
        "div",
        { style: { width: "100%" } },
        React.createElement(
            "label",
            { htmlFor: "proc", className: "form-label" },
            "Text to preprocess:"
        ),
        React.createElement("textarea", {
            id: "proc",
            className: "form-control",
            style: {
                width: "100%",
                maxHeight: "50vh",
                overflowY: "auto",
                fontFamily: "monospace",
            },
            rows: 15,
            value,
            onChange: (e) => onChange(e.target.value),
        })
    );
}
