export const underlineTextDecoration = (context, color, coordinates, scale) => {
    context.beginPath()
    context.lineWidth = '1'
    context.strokeStyle = color
    const y = coordinates[3] * scale
    context.moveTo(coordinates[0] * scale, y)
    context.lineTo(coordinates[2] * scale, y)
    context.stroke()
}