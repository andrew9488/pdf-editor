export const clearContext = (json, pageNumber, context, setWords, canvasSize) => {
    if (json && pageNumber && context) {
        context.clearRect(0, 0, canvasSize.width, canvasSize.height)
        let currentWords = json.filter(j => j.page === pageNumber)
        setWords(currentWords)
    }
}