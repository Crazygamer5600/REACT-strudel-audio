
// console-monkey-patch.js
// This patches console.log to dispatch a "d3Data" event when certain data is logged.
// It also exports a helper for retrieving the last dispatched data.

let lastD3Data = null;

export default function console_monkey_patch() {
    const originalLog = console.log;

    console.log = function (...args) {
        // Forward all logs normally
        originalLog.apply(console, args);

        // If a special D3-like data object is detected, dispatch it
        const d3Candidate = args.find(
            (arg) => arg && typeof arg === 'object' && arg.type === 'd3Data'
        );

        if (d3Candidate) {
            lastD3Data = d3Candidate;
            const event = new CustomEvent('d3Data', { detail: d3Candidate });
            window.dispatchEvent(event);
        }
    };
}

export function getD3Data() {
    return lastD3Data;
}
