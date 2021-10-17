export const accuracy = 839.25

export function canvasHelper(context, word, scale) {
    if (context) {
        let fontSize = (word.coordinates[3] - word.coordinates[1]) * scale
        context.font = `${fontSize}px san-serif`;
        let x = word.coordinates[0] * scale
        let y = (accuracy - word.coordinates[1]) * scale
        context.textBaseline = "alphabetic"
        context.fillText(word.word, x, y)
    }
}