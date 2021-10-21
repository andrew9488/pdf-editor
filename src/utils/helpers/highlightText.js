import {accuracy} from "./canvasHelper";

export const highlightText = (context, color, coordinates, scale) => {
    context.fillStyle = color
    const x = coordinates[0] * scale
    const y = (accuracy - coordinates[3] + 5) * scale
    const width = (coordinates[2] - coordinates[0]) * scale
    const height = (coordinates[3]-2 - coordinates[1]) * scale
    context.fillRect(x, y, width, height)
}