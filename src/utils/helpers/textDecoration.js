import {accuracy} from "./canvasHelper";

export const textDecoration = (context, word, scale) => {
    context.beginPath()
    context.lineWidth = '3'
    context.strokeStyle = "rgb(255,0,11)"
    context.moveTo(word.coordinates[0] * scale, (accuracy - word.coordinates[1]) * scale)
    context.lineTo(word.coordinates[2] * scale, (accuracy - word.coordinates[1]) * scale)
    context.stroke()
}