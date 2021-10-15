import {useCallback} from "react";

export const useFetch = (callback) => {

    const fetch = useCallback(async (...args) => {
        try {
            await callback(...args)
        } catch (e) {
            console.log(e.message)
        }
    }, [callback])

    return [fetch]
}