import { useTypingCtx } from '../context/TypingContext'
import { useTypingSpeed } from '../hooks/useTypingSpeed'
import styles from '../styles/Analytics.module.css'

export const AnalyticsStats = () => {
    const { words, attemptDuration } = useTypingCtx()
    const [wpm, raw] = useTypingSpeed()(words, attemptDuration)

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
