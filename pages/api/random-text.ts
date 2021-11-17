import type { NextApiRequest, NextApiResponse } from 'next'
import randomWords from 'random-words'

export type RandomTextPayload = {
    randomText: string
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<RandomTextPayload>
) {
    const randomText = randomWords({ exactly: 70, join: ' ' })
    res.status(200).json({ randomText })
}
