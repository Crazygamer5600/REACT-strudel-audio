import React from "react";

export default function Controls({ onProcess, onProcPlay, onPlay, onStop }) {
    const buttonStyle = {
        play: { backgroundColor: "green", color: "white", marginRight: "0.5rem" },
        stop: { backgroundColor: "red", color: "white", marginRight: "0.5rem" },
        process: { backgroundColor: "purple", color: "white", marginRight: "0.5rem" },
        procPlay: { backgroundColor: "blue", color: "white", marginRight: "0.5rem" },
    };

    return (
        <nav>
            <button style={buttonStyle.process} onClick={onProcess}>Preprocess</button>
            <button style={buttonStyle.procPlay} onClick={onProcPlay}>Preprocess & Play</button>
            <button style={buttonStyle.play} onClick={onPlay}>Play</button>
            <button style={buttonStyle.stop} onClick={onStop}>Stop</button>
        </nav>
    );
}
