import { useLocalStorage } from 'react-use'
import { TYPING_ATTEMPTS_STORAGE_KEY } from '../constants'
import { TypingSpeed } from '../types'

export const useTypingAttempts = () =>
    useLocalStorage<{ [timestamp: number]: TypingSpeed }>(
        TYPING_ATTEMPTS_STORAGE_KEY
    )
