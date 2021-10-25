export const highlightText = (context, color, coordinates) => {
    context.fillStyle = color
    const x = coordinates[0]
    const y = (coordinates[1] + 4)
    const width = (coordinates[2] - coordinates[0])
    const height = (coordinates[3] - 3 - coordinates[1])
    context.fillRect(x, y, width, height)
}