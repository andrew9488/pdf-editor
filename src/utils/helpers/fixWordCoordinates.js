export const fixWordCoordinates = (arr, size) => {
    let newArr = []
    for (let i = 0; i < arr.length; i++) {
        if (i % 2 === 0) {
            newArr.push((arr[i] * size.width))
        } else {
            newArr.push((arr[i] * size.height))
        }
    }
    return newArr
}