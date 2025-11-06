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

// Bootstrap imports
import AccordionFeature from "./AccordionFeature";
import ModalFeature from "./ModalFeature";
import DropdownFeature from "./DropdownFeature";
import { Toast, ToastContainer, Container, Row } from "react-bootstrap";

export default function StrudelDemo() {
    const [procText, setProcText] = useState(stranger_tune);
    const [bpm, setBpm] = useState(140);
    const [currentTime, setCurrentTime] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const editorContainerRef = useRef(null);
    const canvasRef = useRef(null);
    const globalEditorRef = useRef(null);
    const hasRun = useRef(false);
    const intervalRef = useRef(null);

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

    // Update BPM in Strudel code
    useEffect(() => {
        const updated = procText.replace(/setcps\([^)]*\)/, `setcps(${bpm}/60/4)`);
        setProcText(updated);
        globalEditorRef.current?.setCode(updated);
    }, [bpm]);

    // Playback functions
    const startPlayback = () => {
        if (intervalRef.current) return;
        setPlaying(true);
        const startTime = performance.now() / 1000 - currentTime;

        intervalRef.current = setInterval(() => {
            setCurrentTime(performance.now() / 1000 - startTime);
        }, 50);

        globalEditorRef.current?.evaluate();
        showNotification("Playback started!");
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
        showNotification("Code processed!");
    };

    const handleProcAndPlay = () => {
        stopPlayback();
        handleProcess();
        startPlayback();
    };

    // Show Toast notification
    const showNotification = (message) => {
        setToastMessage(message);
        setShowToast(true);
    };

    // Main return
    return React.createElement(
        React.Fragment,
        null,
        [
            // Toast always on top
            React.createElement(
                ToastContainer,
                { key: "toast-container", position: "bottom-end", className: "p-3", style: { zIndex: 9999 } },
                React.createElement(
                    Toast,
                    {
                        key: "toast",
                        show: showToast,
                        onClose: () => setShowToast(false),
                        delay: 3000,
                        autohide: true
                    },
                    [
                        React.createElement(
                            Toast.Header,
                            { key: "header" },
                            [
                                React.createElement("strong", { key: "strong" }, "Strudel"),
                                React.createElement("small", { key: "small" }, "Just now")
                            ]
                        ),
                        React.createElement(
                            Toast.Body,
                            { key: "body" },
                            toastMessage
                        )
                    ]
                )
            ),

            // Main Strudel content
            React.createElement(
                "div",
                { key: "main-div", style: neonStyles.container },
                [
                    React.createElement("h2", { key: "header", style: neonStyles.header }, "Strudel Demo"),

                    React.createElement(
                        "main",
                        { key: "main", className: "container-fluid" },
                        [
                            // Editor + Controls
                            React.createElement(
                                "div",
                                { key: "editor-row", className: "row", style: neonStyles.row },
                                [
                                    React.createElement(EditorPane, {
                                        key: "editor-pane",
                                        value: procText,
                                        onChange: setProcText,
                                        style: neonStyles.editorPane
                                    }),
                                    React.createElement(Controls, {
                                        key: "controls",
                                        onProcess: handleProcess,
                                        onProcPlay: handleProcAndPlay,
                                        onPlay: startPlayback,
                                        onStop: stopPlayback,
                                        style: neonStyles.controls
                                    })
                                ]
                            ),

                            // BPM Slider + Graph
                            React.createElement(
                                "div",
                                { key: "bpm-row", className: "row my-3", style: neonStyles.row },
                                React.createElement(
                                    "div",
                                    { className: "col-12" },
                                    [
                                        React.createElement("label", { key: "bpm-label", htmlFor: "bpmSlider", style: neonStyles.bpmLabel }, `BPM: ${bpm}`),
                                        React.createElement("input", {
                                            key: "bpm-slider",
                                            id: "bpmSlider",
                                            type: "range",
                                            min: "60",
                                            max: "200",
                                            value: bpm,
                                            onChange: (e) => setBpm(Number(e.target.value)),
                                            className: "form-range",
                                            style: neonStyles.slider
                                        }),
                                        React.createElement("div", { key: "graph-container", style: { width: "100%" } },
                                            React.createElement(BPMGraph, {
                                                bpm: bpm,
                                                currentTime: currentTime,
                                                width: window.innerWidth - 32,
                                                height: 150,
                                                playing: playing
                                            })
                                        )
                                    ]
                                )
                            ),

                            // Editor Output
                            React.createElement(
                                "div",
                                { key: "output-row", className: "row" },
                                React.createElement(
                                    "div",
                                    { className: "col-12" },
                                    [
                                        React.createElement("div", {
                                            key: "editor-container",
                                            ref: editorContainerRef,
                                            id: "editor",
                                            style: { width: "100%" }
                                        }),
                                        React.createElement("div", { key: "output", id: "output", style: neonStyles.outputBox })
                                    ]
                                )
                            ),

                            React.createElement(CanvasView, { key: "canvas-view", ref: canvasRef }),

                            // Bootstrap Interactive Elements
                            React.createElement(
                                Container,
                                { key: "bootstrap-container", className: "my-5" },
                                React.createElement(
                                    Row,
                                    { key: "bootstrap-row", className: "g-4" },
                                    [
                                        React.createElement(AccordionFeature, { key: "acc" }),
                                        React.createElement(ModalFeature, { key: "mod" }),
                                        React.createElement(DropdownFeature, { key: "drop" })
                                    ]
                                )
                            )
                        ]
                    )
                ]
            )
        ]
    );
}
