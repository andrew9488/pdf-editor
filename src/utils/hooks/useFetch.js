import {useCallback, useState} from "react";

export const useFetch = (callback) => {

    const [error, setError] = useState(null)

    const fetch = useCallback(async (...args) => {
        try {
            await callback(...args)
        } catch (e) {
            setError(e.message)
            console.log(e.message)
        }
    }, [callback])

    return [fetch, error]
}