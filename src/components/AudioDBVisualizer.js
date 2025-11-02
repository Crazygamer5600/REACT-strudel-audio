import React, { useEffect, useRef, useState } from "react";
import { processText } from "../utils/textProcessor";
import console_monkey_patch from "../utils/console-monkey-patch";
import "../utils/console-monkey-patch";
import EditorPane from "./EditorPane";
import Controls from "./Controls";
import RadioGroup from "./RadioGroup";
import CanvasView from "./CanvasView";
import { initStrudelEditor } from "../utils/strudelSetup"; // ✅ Import correctly
import { stranger_tune } from "../tunes";

// Live audio visualizer
function AudioDBVisualizer({ analyser }) {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        if (!analyser) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            analyser.getByteTimeDomainData(dataArray);
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let x = 0;
            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = (v * canvas.height) / 2;
                ctx.fillStyle = "#0f0";
                ctx.fillRect(x, canvas.height - y, barWidth, y);
                x += barWidth + 1;
            }

            animationRef.current = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationRef.current);
    }, [analyser]);

    return <canvas ref={canvasRef} width={600} height={200} style={{ width: "100%" }} />;
}

export default function StrudelDemo() {
    const [procText, setProcText] = useState(stranger_tune);
    const [radioValue, setRadioValue] = useState("on");
    const [bpm, setBpm] = useState(140);
    const [analyser, setAnalyser] = useState(null);

    const editorContainerRef = useRef(null);
    const canvasRef = useRef(null);
    const globalEditorRef = useRef(null);
    const hasRun = useRef(false);

    const audioCtxRef = useRef(null);
    const masterGainRef = useRef(null);
    const analyserRef = useRef(null);

    useEffect(() => {
        console_monkey_patch();
        const handleD3Data = (event) => console.log(event.detail);
        document.addEventListener("d3Data", handleD3Data);
        return () => document.removeEventListener("d3Data", handleD3Data);
    }, []);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        // Setup AudioContext + master gain + analyser
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const masterGain = audioCtx.createGain();
        masterGain.gain.value = 1;

        const analyserNode = audioCtx.createAnalyser();
        analyserNode.fftSize = 256;

        masterGain.connect(analyserNode);
        analyserNode.connect(audioCtx.destination);

        audioCtxRef.current = audioCtx;
        masterGainRef.current = masterGain;
        analyserRef.current = analyserNode;

        // Initialize Strudel editor properly
        globalEditorRef.current = initStrudelEditor({
            editorContainer: editorContainerRef.current,
            canvas: canvasRef.current,
            procText,
            radioValue,
        });

        setAnalyser(analyserNode);
    }, []);

    // Update BPM
    useEffect(() => {
        const updated = procText.replace(/setcps\([^)]*\)/, `setcps(${bpm}/60/4)`);
        setProcText(updated);
        globalEditorRef.current?.setCode(updated);
    }, [bpm]);

    const handleProcess = () => {
        const newText = processText(procText, radioValue);
        globalEditorRef.current?.setCode(newText);
    };

    const handlePlay = () => {
        if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();
        globalEditorRef.current?.evaluate();
    };

    const handleProcAndPlay = () => {
        if (globalEditorRef.current?.repl?.state?.started) {
            handleProcess();
            handlePlay();
        }
    };

    const handleStop = () => globalEditorRef.current?.stop();

    return (
        <div>
            <h2>Strudel Demo</h2>
            <main className="container-fluid">
                <div className="row">
                    <EditorPane value={procText} onChange={setProcText} />
                    <Controls
                        onProcess={handleProcess}
                        onProcPlay={handleProcAndPlay}
                        onPlay={handlePlay}
                        onStop={handleStop}
                    />
                </div>

                <div className="row my-3 align-items-center">
                    <div className="col-md-8">
                        <label htmlFor="bpmSlider">BPM: {bpm}</label>
                        <input
                            id="bpmSlider"
                            type="range"
                            min="60"
                            max="200"
                            value={bpm}
                            onChange={(e) => setBpm(Number(e.target.value))}
                            className="form-range w-100"
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-8" style={{ maxHeight: "50vh", overflowY: "auto" }}>
                        <div ref={editorContainerRef} id="editor" />
                        <div id="output" />
                        {analyser && <AudioDBVisualizer analyser={analyser} />}
                    </div>
                    <RadioGroup
                        radioValue={radioValue}
                        onChange={(val) => {
                            setRadioValue(val);
                            handleProcAndPlay();
                        }}
                    />
                </div>
                <CanvasView ref={canvasRef} />
            </main>
        </div>
    );
}
