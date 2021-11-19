import cs from 'classnames'
import { CharState, TypingContextType } from '../context/TypingContext/context'
import styles from '../styles/Typing.module.css'

export const CharBox = ({
    character,
}: {
    character: TypingContextType['words'][number]['typeHistory'][number]['characters'][number]
}) => {
    return (
        <div
            className={cs(styles.char, {
                [styles.incorrect]: character.state === CharState.ERROR,
                [styles.correct]: character.state === CharState.CORRECT,
                [styles.extra]: character.state === CharState.ERROR_EXTRA,
            })}
        >
            {character.value}
        </div>
    )
}
