import React, { forwardRef, useEffect, useRef, useState } from "react";
import { initStrudelEditor } from "../utils/strudelSetup";

const TimelineEditor = forwardRef(({ initialValue }, ref) => {
    const internalRef = useRef(null); // always call useRef
    const containerRef = ref || internalRef; // assign ref or fallback
    const [height, setHeight] = useState(50);

    const computeHeight = (text) => {
        const lines = text.split("\n").length;
        const lineHeight = 20; // adjust to match editor line height
        return lines * lineHeight + 20; // + padding
    };

    useEffect(() => {
        if (!containerRef.current) return;

        initStrudelEditor({
            editorContainer: containerRef.current,
            canvas: null,
            procText: initialValue,
        });

        // Set initial height
        setHeight(computeHeight(initialValue));

        const observer = new MutationObserver(() => {
            const content = containerRef.current.innerText || initialValue;
            setHeight(computeHeight(content));
        });

        observer.observe(containerRef.current, {
            childList: true,
            subtree: true,
            characterData: true,
        });

        return () => observer.disconnect();
    }, [containerRef, initialValue]);

    return (
        <div
            ref={containerRef}
            style={{
                height: height,
                minHeight: 50,
                overflow: "hidden",
                border: "1px solid #ccc",
                padding: "5px",
                whiteSpace: "pre-wrap",
                fontFamily: "monospace",
                width: "100%",
            }}
        >
            {initialValue}
        </div>
    );
});

export default TimelineEditor;
