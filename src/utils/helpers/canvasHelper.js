export function canvasHelper(context, word, scale) {
    if (context) {
        let fontSize = (word.coordinates[3] - word.coordinates[1]) * scale
        context.font = `${fontSize}px serif`;
        let x = word.coordinates[0] * scale
        let y = (839.6 - word.coordinates[1]) * scale
        context.fillText(word.word, x, y)
        // console.log('context x:', x)
        // console.log('context y:', y)
    }
}