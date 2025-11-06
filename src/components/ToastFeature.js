import React, { useState } from "react";
import { Button, Toast, ToastContainer } from "react-bootstrap";

export default function ToastFeature() {
    const [show, setShow] = useState(false);

    return React.createElement(
        "div",
        null,
        [
            React.createElement(
                Button,
                { key: "btn", variant: "info", onClick: () => setShow(true) },
                "Show Toast"
            ),
            React.createElement(
                ToastContainer,
                { key: "container", position: "bottom-end", className: "p-3" },
                React.createElement(
                    Toast,
                    {
                        key: "toast",
                        show: show,
                        onClose: () => setShow(false),
                        delay: 3000,
                        autohide: true
                    },
                    [
                        React.createElement(
                            Toast.Header,
                            { key: "header" },
                            [
                                React.createElement("strong", { key: "strong" }, "System"),
                                React.createElement("small", { key: "small" }, "Just now")
                            ]
                        ),
                        React.createElement(
                            Toast.Body,
                            { key: "body" },
                            "Your data has been saved successfully!"
                        )
                    ]
                )
            )
        ]
    );
}
