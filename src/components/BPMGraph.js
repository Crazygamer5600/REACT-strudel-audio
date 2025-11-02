import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function BPMGraph({ bpm = 140, currentTime = 0, width = 600, height = 100, playing }) {
    const svgRef = useRef();

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const margin = { top: 10, right: 20, bottom: 20, left: 40 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        svg.selectAll("*").remove();
        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleLinear().range([0, innerWidth]);
        const yScale = d3.scaleLinear().domain([0, 1]).range([innerHeight, 0]);

        g.append("g").attr("transform", `translate(0,${innerHeight})`).attr("class", "x-axis");
        g.append("g").attr("class", "y-axis");

        const path = g.append("path").attr("fill", "none").attr("stroke", "#ff6600").attr("stroke-width", 2);

        const timeWindow = 5;

        const draw = () => {
            if (!playing) return;

            const localTime = currentTime;

            // visible X domain
            const xDomain = [localTime - timeWindow, localTime];
            xScale.domain(xDomain);
            g.select(".x-axis").call(d3.axisBottom(xScale).ticks(5));
            g.select(".y-axis").call(d3.axisLeft(yScale));

            const dt = 0.02;
            const points = [];
            for (let t = localTime - timeWindow; t <= localTime; t += dt) {
                const secondsPerBeat = 60 / bpm;
                const beatPos = (t % secondsPerBeat) / secondsPerBeat;

                let value;
                if (beatPos < 0.1) value = 1;
                else {
                    value = 1 - (beatPos - 0.1) / 0.9;
                    if (value < 0) value = 0;
                }

                points.push({ time: t, value });
            }

            const line = d3.line()
                .x(d => xScale(d.time))
                .y(d => yScale(d.value))
                .curve(d3.curveMonotoneX);

            path.datum(points).attr("d", line);
        };

        draw(); // initial draw

    }, [currentTime, bpm, playing, width, height]);

    return <svg ref={svgRef} width={width} height={height}></svg>;
}
