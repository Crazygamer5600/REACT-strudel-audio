import React from "react";
import { Dropdown, Col } from "react-bootstrap";

function DropdownFeature() {
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
              React.createElement(Dropdown.Item, { href: "#/action-1", key: "item1" }, "useless item #1"),
                React.createElement(Dropdown.Item, { href: "#/action-2", key: "item2" }, "useless item #2"),
              React.createElement(Dropdown.Item, { href: "#/action-3", key: "item3" }, "Give me a D Mark!"),
            ]
          ),
        ]
      ),
    ]
  );
}

export default DropdownFeature;
