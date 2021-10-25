export function canvasHelper(context, word) {
    if (context) {
        let fontSize = (word.coordinates[3] - word.coordinates[1])
        context.font = `12px serif`;
        let x = word.coordinates[0]
        let y = (word.coordinates[3])
        context.textBaseline = "alphabetic"
        context.fillText(word.word, x, y)
    }
}