export const lineThroughTextDecoration = (context, color, coordinates) => {
    context.beginPath()
    context.lineWidth = '1px'
    context.strokeStyle = color
    const y = (((coordinates[3] + coordinates[1]) / 2) + 2)
    context.moveTo(coordinates[0], y)
    context.lineTo(coordinates[2], y)
    context.stroke()
}
