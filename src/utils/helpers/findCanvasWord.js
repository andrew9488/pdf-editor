export const findCanvasWord = (method, words, position) => {
    return words[method](w => {
        const startX = w.coordinates[0]
        const endX = w.coordinates[2]
        const startY = w.coordinates[3]
        const endY = w.coordinates[1]
        const clickX = position.x
        const clickY = position.y
        return startX <= clickX && clickX <= endX && endY <= clickY && clickY <= startY
    })
}