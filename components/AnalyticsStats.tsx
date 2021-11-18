import { useTypingCtx } from '../context/TypingContext'
import styles from '../styles/Analytics.module.css'

export const AnalyticsStats = () => {
    const { words, attemptDuration } = useTypingCtx()

    const wpm =
        words.filter((w) => !w.wronglyTyped && w.typeHistory.length).length *
        (60 / attemptDuration)

    const raw =
        words.filter((w) => w.typeHistory.length).length *
        (60 / attemptDuration)

    return (
        <div className={styles.statsNumbers}>
            <div>
                <h1>{wpm}</h1>
                <span>wpm</span>
            </div>

            <div>
                <h1>{raw}</h1>
                <span>raw</span>
            </div>
        </div>
    )
}
