import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import { useTypingCtx } from '../context/TypingContext'
import { calculateRangedCharactersCount } from '../utils/calculateRangedCharactersCount'

export const AnalyticsChart = () => {
    const { words, attemptDuration } = useTypingCtx()

    const startTime = words[0].typeHistory[0].timestamp
    const correctWords = words.filter((w) => !w.wronglyTyped)

    console.log(words)

    const data = Array.from(Array(attemptDuration).keys())
        .map((second) => {
            if (!correctWords.length) return 0

            const leftRelativeTime = new Date(
                startTime.getTime() + second * 1000
            )

            const rightRelativeTime = new Date(
                startTime.getTime() + (second + 1) * 1000
            )

            const relativeAllCharactersCount = calculateRangedCharactersCount(
                words,
                {
                    from: leftRelativeTime,
                    to: rightRelativeTime,
                },
                false
            )

            const relativeCorrectCharactersCount =
                calculateRangedCharactersCount(
                    correctWords,
                    {
                        from: leftRelativeTime,
                        to: rightRelativeTime,
                    },
                    true
                )

            return [relativeCorrectCharactersCount, relativeAllCharactersCount]
        })
        .reduce(
            (acc: any, el: any, idx) => [
                ...acc,
                {
                    second: idx + 1,
                    wpm: (el[0] / 5) * 60,
                    raw: (el[1] / 5) * 60,
                },
            ],
            []
        )

    console.log(data)

    return (
        <ResponsiveContainer height={400} width="100%">
            <LineChart
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis />
                <YAxis yAxisId="left" label={{ value: 'NIgger', angle: -90 }} />
                <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{ value: 'NIgger', angle: 90 }}
                />
                <Tooltip />
                <Legend />
                <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="wpm"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                />
                <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="raw"
                    stroke="#82ca9d"
                />
            </LineChart>
        </ResponsiveContainer>
    )
}
