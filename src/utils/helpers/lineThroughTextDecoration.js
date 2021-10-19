import {accuracy} from "./canvasHelper";

export const lineThroughTextDecoration = (context, color, coordinates, scale) => {
    context.beginPath()
    context.lineWidth = '1'
    context.strokeStyle = color
    const y = ((accuracy - (coordinates[3] + coordinates[1]) / 2) + 3)
    context.moveTo(coordinates[0] * scale, y * scale)
    context.lineTo(coordinates[2] * scale, y * scale)
    context.stroke()
}
