import React from "react";
import { Accordion, Col } from "react-bootstrap";

function AccordionFeature() {
  return React.createElement(
    Col,
    { md: 6 },
    [
      React.createElement("h5", { key: "title" }, "Accordion Feature"),
      React.createElement(
        Accordion,
        { key: "accordion", defaultActiveKey: "0" },
        [
          React.createElement(
            Accordion.Item,
            { eventKey: "0", key: "item1" },
            [
              React.createElement(
                Accordion.Header,
                { key: "header1" },
                "About the Project"
              ),
              React.createElement(
                Accordion.Body,
                { key: "body1" },
                "This section explains what your project is about."
              ),
            ]
          ),
          React.createElement(
            Accordion.Item,
            { eventKey: "1", key: "item2" },
            [
              React.createElement(
                Accordion.Header,
                { key: "header2" },
                "How It Works"
              ),
              React.createElement(
                Accordion.Body,
                { key: "body2" },
                "This section describes your app’s functionality."
              ),
            ]
          ),
        ]
      ),
    ]
  );
}

export default AccordionFeature;
