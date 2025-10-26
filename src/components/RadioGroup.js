import React from "react";

export default function RadioGroup({ radioValue, onChange }) {
    return React.createElement(
        "div",
        { className: "col-md-4" },
        React.createElement(
            "div",
            { className: "form-check" },
            React.createElement("input", {
                className: "form-check-input",
                type: "radio",
                name: "p1",
                id: "p1_on",
                value: "on",
                checked: radioValue === "on",
                onChange: (e) => onChange(e.target.value),
            }),
            React.createElement("label", { className: "form-check-label", htmlFor: "p1_on" }, "p1: ON")
        ),
        React.createElement(
            "div",
            { className: "form-check" },
            React.createElement("input", {
                className: "form-check-input",
                type: "radio",
                name: "p1",
                id: "p1_hush",
                value: "hush",
                checked: radioValue === "hush",
                onChange: (e) => onChange(e.target.value),
            }),
            React.createElement("label", { className: "form-check-label", htmlFor: "p1_hush" }, "p1: HUSH")
        )
    );
}
