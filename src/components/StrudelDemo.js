import React, { useEffect, useRef, useState } from "react";
import { processText } from "../utils/textProcessor";
import console_monkey_patch from "../utils/console-monkey-patch";
import "../utils/console-monkey-patch";
import EditorPane from "./EditorPane";
import Controls from "./Controls";
import CanvasView from "./CanvasView";
import { initStrudelEditor } from "../utils/strudelSetup";
import { stranger_tune } from "../tunes";
import BPMGraph from "./BPMGraph";

export default function StrudelDemo() {
    const [procText, setProcText] = useState(stranger_tune);
    const [bpm, setBpm] = useState(140);
    const [currentTime, setCurrentTime] = useState(0);
    const [playing, setPlaying] = useState(false);

    const editorContainerRef = useRef(null);
    const canvasRef = useRef(null);
    const globalEditorRef = useRef(null);
    const hasRun = useRef(false);
    const intervalRef = useRef(null);

    // Neon theme styles
    const neonStyles = {
        container: {
            backgroundColor: "#0f0f1a",
            color: "#39ff14",
            minHeight: "100vh",
            padding: "1rem",
            fontFamily: "'Courier New', Courier, monospace",
        },
        header: { color: "#00fff7", textAlign: "center", marginBottom: "1rem" },
        row: { marginBottom: "1rem" },
        editorPane: { backgroundColor: "#1a1a2e", borderRadius: "8px", padding: "0.5rem" },
        slider: { accentColor: "#ff0099", width: "100%" },
        bpmLabel: { color: "#ff77ff", marginBottom: "0.5rem", display: "block" },
        controls: { marginTop: "0.5rem" },
        outputBox: { textAlign: "left", whiteSpace: "pre-wrap" }
    };

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
        if (intervalRef.current) return;
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
        const newText = processText(procText);
        globalEditorRef.current?.setCode(newText);
    };

    const handleProcAndPlay = () => {
        stopPlayback();
        handleProcess();
        startPlayback();
    };

    return React.createElement(
        "div",
        { style: neonStyles.container },
        React.createElement("h2", { style: neonStyles.header }, "Strudel Demo"),

        React.createElement(
            "main",
            { className: "container-fluid" },

            // Editor + Controls
            React.createElement(
                "div",
                { className: "row", style: neonStyles.row },
                React.createElement(EditorPane, {
                    value: procText,
                    onChange: setProcText,
                    style: neonStyles.editorPane
                }),
                React.createElement(Controls, {
                    onProcess: handleProcess,
                    onProcPlay: handleProcAndPlay,
                    onPlay: startPlayback,
                    onStop: stopPlayback,
                    style: neonStyles.controls
                })
            ),

            // BPM Slider + Graph
            React.createElement(
                "div",
                { className: "row my-3", style: neonStyles.row },
                React.createElement(
                    "div",
                    { className: "col-12" },
                    React.createElement("label", { htmlFor: "bpmSlider", style: neonStyles.bpmLabel }, `BPM: ${bpm}`),
                    React.createElement("input", {
                        id: "bpmSlider",
                        type: "range",
                        min: "60",
                        max: "200",
                        value: bpm,
                        onChange: (e) => setBpm(Number(e.target.value)),
                        className: "form-range",
                        style: neonStyles.slider
                    }),
                    React.createElement("div", { style: { width: "100%" } },
                        React.createElement(BPMGraph, {
                            bpm: bpm,
                            currentTime: currentTime,
                            width: window.innerWidth - 32,
                            height: 150,
                            playing: playing
                        })
                    )
                )
            ),

            // Timeline / Output (fit content)
            React.createElement(
                "div",
                { className: "row" },
                React.createElement(
                    "div",
                    { className: "col-12" },
                    React.createElement("div", {
                        ref: editorContainerRef,
                        id: "editor",
                        style: { width: "100%" } // allow Strudel editor to handle its own height
                    }),
                    React.createElement("div", { id: "output", style: neonStyles.outputBox })
                )
            ),

            React.createElement(CanvasView, { ref: canvasRef })
        )
    );
}
