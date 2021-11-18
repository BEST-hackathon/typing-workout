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
import styles from '../styles/Analytics.module.css'

export const UserProgressChart = () => {
    const chartsData = [{ wpm: 40 }, { wpm: 50 }, { wpm: 37 }, { wpm: 60 }]

    return (
        <>
            <h1 className={styles.title}>
                Your <span>WPM</span> improvements
            </h1>

            <ResponsiveContainer height={300} width="100%">
                <LineChart data={chartsData}>
                    <CartesianGrid />
                    <XAxis />
                    <YAxis yAxisId="left" />
                    <YAxis orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="wpm"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </>
    )
}
