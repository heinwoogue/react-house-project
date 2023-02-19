import { useEffect, useState } from "react"

export const NEW_HOUSE = 'newHouse';
export const ACTIVE_STEP = 'activeStep';

type LocalStorageKey = typeof NEW_HOUSE | typeof ACTIVE_STEP;

export function useLocalStorage<T>(key: LocalStorageKey, initialValue: T ): [T, typeof setValue] {
    const [value, setValue] = useState<T>(() => {
        const jsonValue = localStorage.getItem(key)
        if (jsonValue == null) {
            return initialValue
        } else {
            return JSON.parse(jsonValue)
        }
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [key, value])

    return [value, setValue]
}
