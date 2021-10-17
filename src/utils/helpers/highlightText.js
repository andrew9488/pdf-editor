import {accuracy} from "./canvasHelper";

export const highlightText=(context, color, word, scale)=>{
    context.fillStyle = color
    context.opacity = 0.2
    const x = word.coordinates[0] * scale
    const y = (accuracy - word.coordinates[3]) * scale
    const width = (word.coordinates[2] - word.coordinates[0]) * scale
    const height = (word.coordinates[3] - word.coordinates[1]) * scale
    context.fillRect(x, y, width, height)
}