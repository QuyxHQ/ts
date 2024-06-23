import React from 'react'
import { Loader } from '../../icons'
import { Connect, Connected, ImportCredential } from './components'
import useInApp from '../../hooks/useInApp'
import { useIsConnectionRestored } from '@tonconnect/ui-react'

type ConnectBtnProps = {
    className?: string
    connectBtn?: React.JSX.Element
    importBtn?: React.JSX.Element
    connectedBtn?: React.JSX.Element
}

const ConnectBtn: React.FC<ConnectBtnProps> = (props) => {
    const { isMounting, user, credential, isAuthenticating } = useInApp()
    const isConnectionRestored = useIsConnectionRestored()

    return isMounting || !isConnectionRestored || isAuthenticating ? (
        <button className="btn" disabled>
            <div className="w-100 d-flex align-items-center justify-content-center">
                <Loader size={18} />
            </div>
        </button>
    ) : !user ? (
        <Connect children={props.connectBtn} className={props.className} />
    ) : !credential ? (
        <ImportCredential children={props.importBtn} className={props.className} />
    ) : (
        <Connected children={props.connectedBtn} className={props.className} />
    )
}

export default ConnectBtn
