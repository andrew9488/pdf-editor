export const getCoordinates = (e, parent, setPosition,) => {
    let x = e.clientX - parent.left
    let y = e.clientY - parent.top
    setPosition({x: x, y: y})
}