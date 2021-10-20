export const setEffectsToSessionStorage = (word, color, type) => {
    const effect = {
        page: word.page,
        color: color,
        coordinates: word.coordinates,
        type: type,
    }
    let effects = JSON.parse(sessionStorage.getItem('effects'))
    if (effects === null) {
        effects = {[word.page]: []}
    } else if (effects[word.page] === undefined) {
        effects = {...effects, [word.page]: []}
    }
    effects[word.page] = [...effects[word.page], effect]
    effects[word.page] = effects[word.page].map(e => (e.coordinates[0] === effect.coordinates[0] && e.coordinates[1] === effect.coordinates[1] && e.coordinates[2] === effect.coordinates[2] && e.coordinates[3] === effect.coordinates[3]) ? effect : e)
    sessionStorage.setItem('effects', JSON.stringify(effects))
}

export const getEffectsFromSessionStorage = (page) => {
    let effects = sessionStorage.getItem('effects')
    if (effects) {
        let effectsCanvas = JSON.parse(effects)
        return effectsCanvas[page]
    }
}