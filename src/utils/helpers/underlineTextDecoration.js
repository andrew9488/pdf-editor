import {accuracy} from "./canvasHelper";

export const underlineTextDecoration = (context, word, scale) => {
    context.beginPath()
    context.lineWidth = '2'
    context.strokeStyle = "rgb(17,17,17)"
    const y = accuracy - word.coordinates[1] + 2
    context.moveTo(word.coordinates[0] * scale, y * scale)
    context.lineTo(word.coordinates[2] * scale, y * scale)
    context.stroke()
}