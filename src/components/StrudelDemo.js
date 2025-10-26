import React, { useEffect, useRef, useState } from "react";
import { initStrudelEditor } from "../utils/strudelSetup";
import { processText } from "../utils/textProcessor";
import { stranger_tune } from "../tunes";
import console_monkey_patch from "../utils/console-monkey-patch";
import '../utils/console-monkey-patch';
import EditorPane from "./EditorPane";
import Controls from "./Controls";
import RadioGroup from "./RadioGroup";
import CanvasView from "./CanvasView";

export default function StrudelDemo() {
    const [procText, setProcText] = useState(stranger_tune);
    const [radioValue, setRadioValue] = useState("on");
    const editorContainerRef = useRef(null);
    const canvasRef = useRef(null);
    const globalEditorRef = useRef(null);
    const hasRun = useRef(false);

    useEffect(() => {
        console_monkey_patch();
        const handleD3Data = (event) => console.log(event.detail);
        document.addEventListener("d3Data", handleD3Data);
        return () => document.removeEventListener("d3Data", handleD3Data);
    }, []);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;
        globalEditorRef.current = initStrudelEditor({
            editorContainer: editorContainerRef.current,
            canvas: canvasRef.current,
            procText,
            radioValue,
        });
    }, []);

    const handleProcess = () => {
        const newText = processText(procText, radioValue);
        globalEditorRef.current?.setCode(newText);
    };

    const handlePlay = () => globalEditorRef.current?.evaluate();

    const handleProcAndPlay = () => {
        if (globalEditorRef.current?.repl?.state?.started) {
            handleProcess();
            handlePlay();
        }
    };

    const handleStop = () => globalEditorRef.current?.stop();

    return React.createElement(
        "div",
        null,
        React.createElement("h2", null, "Strudel Demo"),
        React.createElement(
            "main",
            { className: "container-fluid" },
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(EditorPane, { value: procText, onChange: setProcText }),
                React.createElement(Controls, {
                    onProcess: handleProcess,
                    onProcPlay: handleProcAndPlay,
                    onPlay: handlePlay,
                    onStop: handleStop,
                })
            ),
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col-md-8", style: { maxHeight: "50vh", overflowY: "auto" } },
                    React.createElement("div", { ref: editorContainerRef, id: "editor" }),
                    React.createElement("div", { id: "output" })
                ),
                React.createElement(RadioGroup, {
                    radioValue: radioValue,
                    onChange: (val) => {
                        setRadioValue(val);
                        handleProcAndPlay();
                    },
                })
            ),
            React.createElement(CanvasView, { ref: canvasRef })
        )
    );
}
