export const setEffectsToSessionStorage = (word, color, type, scale) => {
    const effect = {
        page: word.page,
        color: color,
        coordinates: word.coordinates,
        type: type,
        scale: scale
    }
    let effects = JSON.parse(sessionStorage.getItem('effects'))
    if (effects === null) {
        effects = {[word.page]: []}
    } else if (effects[word.page] === undefined) {
        effects = {...effects, [word.page]: []}
    }
    effects[word.page] = [...effects[word.page], effect]
    effects[word.page] = effects[word.page].map(e => (
        e.coordinates[0] === effect.coordinates[0] &&
        e.coordinates[1] === effect.coordinates[1] &&
        e.coordinates[2] === effect.coordinates[2] &&
        e.coordinates[3] === effect.coordinates[3]
    ) ? effect : e)
    effects[word.page] = [...new Set(effects[word.page])]
    sessionStorage.setItem('effects', JSON.stringify(effects))
}

export const getEffectsFromSessionStorage = (page) => {
    let effects = sessionStorage.getItem('effects')
    if (effects) {
        let effectsCanvas = JSON.parse(effects)
        return effectsCanvas[page]
    }
}

export const getEffectFromSessionStorageForSelectedWord = (word, page, scale) => {
    let effects = sessionStorage.getItem('effects')
    if (effects) {
        let effectsCanvas = JSON.parse(effects)
        return effectsCanvas[page].find(e => e.scale !== 1
            ? (Math.floor(e.coordinates[0]) === Math.floor(word.coordinates[0])
                && Math.floor(e.coordinates[1]) === Math.floor(word.coordinates[1])
                && Math.floor(e.coordinates[2]) === Math.floor(word.coordinates[2])
                && Math.floor(e.coordinates[3]) === Math.floor(word.coordinates[3]))
            : (Math.floor(e.coordinates[0]) === Math.floor(word.coordinates[0]/ scale)
                && Math.floor(e.coordinates[1]) === Math.floor(word.coordinates[1] / scale)
                && Math.floor(e.coordinates[2]) === Math.floor(word.coordinates[2] / scale)
                && Math.floor(e.coordinates[3]) === Math.floor(word.coordinates[3] / scale))
        )
    }
}
export const clearSessionStorage = () => {
    sessionStorage.clear()
}