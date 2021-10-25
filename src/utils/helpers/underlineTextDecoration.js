export const underlineTextDecoration = (context, color, coordinates) => {
    context.beginPath()
    context.lineWidth = '1px'
    context.strokeStyle = color
    const y = (coordinates[3] - 1)
    context.moveTo(coordinates[0], y)
    context.lineTo(coordinates[2], y)
    context.stroke()
}