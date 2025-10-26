import React, { forwardRef } from "react";

const CanvasView = forwardRef(function CanvasView(_, ref) {
    return React.createElement("canvas", { ref, id: "roll" });
});

export default CanvasView;
