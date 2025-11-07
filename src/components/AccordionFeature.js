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
                "Welcome To My Strudel Music App! \n This application is designed to make music producton with strudel more streamlined."
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
                "Modify the default music by adapting audio Parameters above!"
              ),
            ]
          ),
        ]
      ),
    ]
  );
}

export default AccordionFeature;
