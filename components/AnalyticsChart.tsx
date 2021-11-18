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
import { CharState } from '../context/TypingContext'
import styles from '../styles/Analytics.module.css'
import { useTypingCtx } from '../context/TypingContext'

const useAnalyticsChartData = () => {
    const { words, attemptDuration, secondsLeft } = useTypingCtx()

    if (secondsLeft !== 0) {
        return null
    }

    const attemptStart = words[0].typeHistory[0].timestamp.getTime()

    const secondToData = Array.from({ length: attemptDuration }).reduce<
        Record<number, { allCharsCount: number; correctCharsCount: number }>
    >((acc, _, idx) => {
        acc[idx + 1] = { allCharsCount: 0, correctCharsCount: 0 }
        return acc
    }, {})

    words.forEach((word) =>
        word.typeHistory.forEach((historyEntry, historyEntryIdx, history) => {
            const secondsFromStart = Math.floor(
                (historyEntry.timestamp.getTime() - attemptStart) / 1000
            )
            const prevHistoryEntry = history[historyEntryIdx - 1]

            // when user typed new character (not backslash)
            if (
                (prevHistoryEntry?.characters.length || 0) <
                historyEntry.characters.length
            ) {
                const newChar = historyEntry.characters.at(-1)
                if (newChar?.state === CharState.CORRECT) {
                    secondToData[secondsFromStart + 1].correctCharsCount++
                }
                secondToData[secondsFromStart + 1].allCharsCount++
            }
        })
    )

    return Object.entries(secondToData).map(([second, data]) => ({
        second,
        wpm: (data.correctCharsCount * 60) / 5,
        raw: (data.allCharsCount * 60) / 5,
    }))
}

export const AnalyticsChart = () => {
    const chartsData = useAnalyticsChartData()

    if (!chartsData) {
        return <div>Complete the typing test!</div>
    }

    return (
        <>
            <h1 className={styles.title}>
                <span>RAW</span> and <span>WPM</span> stats
            </h1>
            <ResponsiveContainer height={300} width="100%">
                <LineChart data={chartsData}>
                    <CartesianGrid />
                    <XAxis />
                    <YAxis
                        yAxisId="left"
                        // label={{ value: 'NIgger', angle: -90 }}
                    />
                    <YAxis yAxisId="right" orientation="right" />
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
        </>
    )
}
