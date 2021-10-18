import {accuracy} from "./canvasHelper";

export const clearContextHighlight = (context, word, scale) => {
    const x = word.coordinates[0] * scale
    const y = (accuracy - word.coordinates[3] + 2) * scale
    const width = (word.coordinates[2] - word.coordinates[0]) * scale
    const height = (word.coordinates[3] - word.coordinates[1]) * scale
    context.clearRect(x, y, width, height)
}
