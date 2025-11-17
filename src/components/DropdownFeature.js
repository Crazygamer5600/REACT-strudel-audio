import React from "react";
import { Dropdown, Col, Button } from "react-bootstrap";

function DropdownFeature({ savedPresets = [], onSelectPreset = () => { }, onRemovePreset = () => { } }) {
    return React.createElement(
        Col,
        { md: 6 },
        [
            React.createElement("h5", { key: "title" }, "Dropdown Feature"),
            React.createElement(
                Dropdown,
                { key: "dropdown" },
                [
                    React.createElement(
                        Dropdown.Toggle,
                        { variant: "success", id: "dropdown-basic", key: "toggle" },
                        "Options"
                    ),
                    React.createElement(
                        Dropdown.Menu,
                        { key: "menu" },
                        [

                            // Divider
                            savedPresets.length > 0 ? React.createElement(Dropdown.Divider, { key: "divider" }) : null,

                            // Dynamic saved presets with X button
                            ...savedPresets.map((preset, idx) =>
                                React.createElement(
                                    Dropdown.Item,
                                    { key: `preset-${idx}`, className: "d-flex justify-content-between align-items-center" },
                                    [
                                        // Clickable preset name
                                        React.createElement(
                                            "span",
                                            { key: "name", style: { cursor: "pointer" }, onClick: () => onSelectPreset(idx) },
                                            preset.name
                                        ),
                                        // Remove button
                                        React.createElement(
                                            Button,
                                            {
                                                key: "remove",
                                                variant: "danger",
                                                size: "sm",
                                                onClick: (e) => {
                                                    e.stopPropagation(); // prevent opening the preset
                                                    onRemovePreset(idx);
                                                }
                                            },
                                            "X"
                                        )
                                    ]
                                )
                            )
                        ]
                    )
                ]
            )
        ]
    );
}

export default DropdownFeature;
