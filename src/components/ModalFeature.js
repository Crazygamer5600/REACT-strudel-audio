import React, { useState } from "react";
import { Button, Modal, Col } from "react-bootstrap";

function ModalFeature() {
  const [show, setShow] = useState(false);

  return React.createElement(
    Col,
    { md: 6 },
    [
      React.createElement("h5", { key: "title" }, "Modal Feature"),
      React.createElement(
        Button,
        { key: "btn", variant: "primary", onClick: () => setShow(true) },
        "Open Modal"
      ),
      React.createElement(
        Modal,
        { key: "modal", show: show, onHide: () => setShow(false) },
        [
          React.createElement(
            Modal.Header,
            { key: "header", closeButton: true },
            React.createElement(Modal.Title, null, "Project Details")
          ),
          React.createElement(
            Modal.Body,
            { key: "body" },
            "Here you can display more detailed project information."
          ),
          React.createElement(
            Modal.Footer,
            { key: "footer" },
            React.createElement(
              Button,
              { variant: "secondary", onClick: () => setShow(false) },
              "Close"
            )
          ),
        ]
      ),
    ]
  );
}

export default ModalFeature;
