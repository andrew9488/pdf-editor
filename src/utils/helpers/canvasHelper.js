export const accuracy = 839.25

export function canvasHelper(context, word) {
    if (context) {
        let fontSize = (word.coordinates[3] - word.coordinates[1])
        context.font = `${fontSize}px sans-serif`;
        let x = word.coordinates[0]
        let y = (accuracy - word.coordinates[1])
        context.textBaseline = "alphabetic"
        context.fillText(word.word, x, y)
    }
}