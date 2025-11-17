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
            "This Project by no means is intended to replace a traditional daw, it is to be \nused in conjunction with traditional recording tools like obs in order to get audio."
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
