export const clearContextHighlight = (context, coordinates) => {
    const x = (coordinates[0] - 1)
    const y = (coordinates[1] + 3)
    const width = (coordinates[2] + 2 - coordinates[0])
    const height = (coordinates[3]-1 - coordinates[1])
    context.clearRect(x, y, width, height)
}
