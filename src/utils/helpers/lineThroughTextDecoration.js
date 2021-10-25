export const lineThroughTextDecoration = (context, color, coordinates, scale) => {
    context.beginPath()
    context.lineWidth = '1'
    context.strokeStyle = color
    const y = (((coordinates[3] + coordinates[1]) / 2) + 4)
    context.moveTo(coordinates[0] * scale, y * scale)
    context.lineTo(coordinates[2] * scale, y * scale)
    context.stroke()
}
