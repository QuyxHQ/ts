import React, { useState } from 'react'
import { storage } from '@quyx/sdk'
import { ConnectComponentProps } from '../../../types'
import { CaretDown, Copy, Disconnect } from '../../../icons'
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react'
import { truncateAddress } from '../../../utils/helpers'
import useInApp from '../../../hooks/useInApp'

const Connected: React.FC<ConnectComponentProps> = ({ children, className }) => {
    const [displayDrop, setDisplayDrop] = useState<boolean>(false)
    const [text, setText] = useState<string>()
    const address = useTonAddress()
    const [tonConnectUI] = useTonConnectUI()
    const { theme } = useInApp()

    function copyAddress() {
        if (!navigator.clipboard || !address) return
        navigator.clipboard.writeText(address)

        setText('Address copied!')
        setTimeout(() => setText(undefined), 1500)
    }

    async function disconnect() {
        await Promise.all([
            tonConnectUI.disconnect(),
            storage.removeItem('access_token'),
            storage.removeItem('refresh_token'),
        ])

        setDisplayDrop(false)
    }

    return children ? (
        <button className={className}>{children}</button>
    ) : (
        <div className="dropdown-container">
            <button
                className={`btn connected ${className}`}
                style={{ paddingLeft: '1.1rem', paddingRight: '1.1rem', gap: '0.4rem' }}
                onClick={() => setDisplayDrop(!displayDrop)}
            >
                <div>{truncateAddress(address)}</div>
                <CaretDown className="rotate-caret" fill="#ddd" size={15} />
            </button>

            <div
                className={`dropdown ${theme}`}
                style={displayDrop ? { display: 'block' } : { display: 'none' }}
            >
                <ul>
                    <li onClick={copyAddress}>
                        <Copy />
                        <p>{text ? text : 'Copy address'}</p>
                    </li>

                    <li onClick={disconnect}>
                        <Disconnect />
                        <p>Disconnect</p>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Connected
