import {accuracy} from "./canvasHelper";

export const clearContextHighlight = (context, word, scale) => {
    const x = (word.coordinates[0]-1) * scale
    const y = (accuracy - word.coordinates[3] + 1) * scale
    const width = (word.coordinates[2]+2 - word.coordinates[0]) * scale
    const height = (word.coordinates[3]+4 - word.coordinates[1]) * scale
    context.clearRect(x, y, width, height)
}
