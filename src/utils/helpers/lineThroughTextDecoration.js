import {accuracy} from "./canvasHelper";

export const lineThroughTextDecoration = (context, word, scale) => {
    context.beginPath()
    context.lineWidth = '3'
    context.strokeStyle = "rgb(255,0,11)"
    const y = ((accuracy - (word.coordinates[3] + word.coordinates[1]) / 2) + 3)
    context.moveTo(word.coordinates[0] * scale, y * scale)
    context.lineTo(word.coordinates[2] * scale, y * scale)
    context.stroke()
}
