export const underlineTextDecoration = (context, color, coordinates, scale) => {
    context.beginPath()
    context.lineWidth = '1px'
    context.strokeStyle = color
    const y = (coordinates[3]-1) * scale
    context.moveTo(coordinates[0] * scale, y)
    context.lineTo(coordinates[2] * scale, y)
    context.stroke()
}