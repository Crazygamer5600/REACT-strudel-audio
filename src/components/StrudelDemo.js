import React, { useEffect, useRef, useState } from "react";
import { processText } from "../utils/textProcessor";
import console_monkey_patch from "../utils/console-monkey-patch";
import "../utils/console-monkey-patch";
import EditorPane from "./EditorPane";
import Controls from "./Controls";
import RadioGroup from "./RadioGroup";
import CanvasView from "./CanvasView";
import { initStrudelEditor } from "../utils/strudelSetup";
import { stranger_tune } from "../tunes";
import BPMGraph from "./BPMGraph";

export default function StrudelDemo() {
    const [procText, setProcText] = useState(stranger_tune);
    const [radioValue, setRadioValue] = useState("on");
    const [bpm, setBpm] = useState(140);
    const [currentTime, setCurrentTime] = useState(0);
    const [playing, setPlaying] = useState(false);

    const editorContainerRef = useRef(null);
    const canvasRef = useRef(null);
    const globalEditorRef = useRef(null);
    const hasRun = useRef(false);
    const intervalRef = useRef(null);

    // Initialize Strudel editor
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

    // Update Strudel code when BPM changes
    useEffect(() => {
        const updated = procText.replace(
            /setcps\([^)]*\)/,
            `setcps(${bpm}/60/4)`
        );
        setProcText(updated);
        globalEditorRef.current?.setCode(updated);
    }, [bpm]);

    // Playback interval
    const startPlayback = () => {
        if (intervalRef.current) return; // already running
        setPlaying(true);
        const startTime = performance.now() / 1000 - currentTime;

        intervalRef.current = setInterval(() => {
            const newTime = performance.now() / 1000 - startTime;
            setCurrentTime(newTime);
        }, 50);

        globalEditorRef.current?.evaluate();
    };

    const stopPlayback = () => {
        setPlaying(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        globalEditorRef.current?.stop();
    };

    const handleProcess = () => {
        const newText = processText(procText, radioValue);
        globalEditorRef.current?.setCode(newText);
    };

    const handleProcAndPlay = () => {
        if (globalEditorRef.current?.repl?.state?.started) {
            handleProcess();
            startPlayback();
        }
    };

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
                    onPlay: startPlayback,
                    onStop: stopPlayback,
                })
            ),

            // BPM Slider + Graph
            React.createElement(
                "div",
                { className: "row my-3 align-items-center" },
                React.createElement(
                    "div",
                    { className: "col-md-8" },
                    React.createElement("label", { htmlFor: "bpmSlider" }, `BPM: ${bpm}`),
                    React.createElement("input", {
                        id: "bpmSlider",
                        type: "range",
                        min: "60",
                        max: "200",
                        value: bpm,
                        onChange: (e) => setBpm(Number(e.target.value)),
                        className: "form-range w-100"
                    }),
                    React.createElement(BPMGraph, {
                        bpm,
                        currentTime,
                        width: 600,
                        height: 100,
                        playing
                    })
                )
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
