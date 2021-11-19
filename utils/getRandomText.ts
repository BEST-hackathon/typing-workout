import { RandomTextPayload } from '../pages/api/random-text'

export const getRandomText = (origin = '') =>
    fetch(`${origin}/api/random-text`)
        .then<RandomTextPayload>((res) => res.json())
        .then((res) => res.randomText)
