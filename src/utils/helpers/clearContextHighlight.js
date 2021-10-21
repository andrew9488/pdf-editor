import {accuracy} from "./canvasHelper";

export const clearContextHighlight = (context, coordinates, scale) => {
    const x = (coordinates[0] - 1) * scale
    const y = (accuracy - coordinates[3] + 6) * scale
    const width = (coordinates[2] + 2 - coordinates[0]) * scale
    const height = (coordinates[3]-2 - coordinates[1]) * scale
    context.clearRect(x, y, width, height)
}
