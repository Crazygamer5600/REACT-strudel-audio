import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

function NoteTimeline({ notes, width = 800, height = 400 }) {
    const svgRef = useRef();
    const [currentTime, setCurrentTime] = useState(0);

    // Increment currentTime every 100ms
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime((t) => t + 0.1);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // clear previous drawings

        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const g = svg
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Scrolling 5-second window
        const xScale = d3
            .scaleLinear()
            .domain([currentTime, currentTime + 5])
            .range([0, innerWidth]);

        const yScale = d3.scaleLinear().domain([0, 127]).range([innerHeight, 0]);

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        // Draw axes
        g.append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale));
        g.append("g").call(d3.axisLeft(yScale));

        // Filter notes in the visible window
        const visibleNotes = notes.filter(
            (n) => n.start + n.duration >= currentTime && n.start <= currentTime + 5
        );

        // Draw notes
        g.selectAll("rect")
            .data(visibleNotes)
            .enter()
            .append("rect")
            .attr("x", (d) => xScale(d.start))
            .attr("y", (d) => yScale(d.pitch + 1))
            .attr("width", (d) => xScale(d.start + d.duration) - xScale(d.start))
            .attr("height", 8)
            .attr("fill", (d) => colorScale(d.pattern || d.instrument));
    }, [notes, currentTime, width, height]);

    return <svg ref={svgRef} width={width} height={height}></svg>;
}

export default NoteTimeline;
