import { StrudelMirror } from "@strudel/codemirror";
import { evalScope } from "@strudel/core";
import { drawPianoroll } from "@strudel/draw";
import {
    initAudioOnFirstClick,
    webaudioOutput,
    getAudioContext,
    registerSynthSounds,
} from "@strudel/webaudio";
import { registerSoundfonts } from "@strudel/soundfonts";
import { transpiler } from "@strudel/transpiler";
import { processText } from "./textProcessor";

export function initStrudelEditor({ editorContainer, canvas, procText, radioValue }) {
    const ctx = canvas.getContext("2d");
    canvas.width *= 2;
    canvas.height *= 2;
    const drawTime = [-2, 2];

    const editor = new StrudelMirror({
        defaultOutput: webaudioOutput,
        getTime: () => getAudioContext().currentTime,
        transpiler,
        root: editorContainer,
        drawTime,
        onDraw: (haps, time) => drawPianoroll({ haps, time, ctx, drawTime, fold: 0 }),
        prebake: async () => {
            initAudioOnFirstClick();
            const loadModules = evalScope(
                import("@strudel/core"),
                import("@strudel/draw"),
                import("@strudel/mini"),
                import("@strudel/tonal"),
                import("@strudel/webaudio")
            );
            await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
        },
    });

    editor.setCode(processText(procText, radioValue));
    return editor;
}
