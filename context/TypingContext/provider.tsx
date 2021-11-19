import { FC, useContext } from 'react'
import { TypingContext, TypingContextType } from './context'
import { useTypingState } from './logic'

export type TypingCtxProps = {
    initialText: string
    fetchText: () => Promise<string>
    onComplete: (
        ctx: Pick<TypingContextType, 'words' | 'attemptDuration'>
    ) => void
    attemptDuration: number
}

export const TypingCtxProvider: FC<TypingCtxProps> = ({
    children,
    ...props
}) => {
    const data = useTypingState(props)

    return (
        <TypingContext.Provider value={data}>{children}</TypingContext.Provider>
    )
}

export const useTypingCtx = () => useContext(TypingContext)
