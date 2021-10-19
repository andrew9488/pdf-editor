export const setEffectsToSessionStorage = (context, word, color, type, scale) => {
    const effect = {
        page: word.page,
        context: context,
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
    effects[word.page].push(effect)
    sessionStorage.setItem('effects', JSON.stringify(effects))
}

export const getEffectsFromSessionStorage = (page) => {
    let effects = sessionStorage.getItem('effects')
    if (effects) {
        let effectsCanvas = JSON.parse(effects)
        return effectsCanvas[page]
    }
}