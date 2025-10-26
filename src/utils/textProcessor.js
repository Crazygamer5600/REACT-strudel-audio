export function processText(text, mode) {
    const replace = mode === "hush" ? "_" : "";
    return text.replaceAll("<p1_Radio>", replace);
}
