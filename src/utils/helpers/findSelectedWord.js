import {accuracy} from "./canvasHelper";

export const findSelectedWord = (words, position, scale) => {
    return words.find(w => {
        const startX = w.coordinates[0] * scale
        const endX = w.coordinates[2] * scale
        const startY = (accuracy - w.coordinates[1]) * scale
        const endY = (accuracy - w.coordinates[3]) * scale
        const clickX = position.x
        const clickY = position.y
        return startX <= clickX && clickX <= endX && endY <= clickY && clickY <= startY
    })
}