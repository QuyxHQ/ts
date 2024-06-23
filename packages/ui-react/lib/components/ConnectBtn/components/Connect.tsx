import React, { useEffect } from 'react'
import { QuyxForUI, storage } from '@quyx/sdk'
import { THEME, useTonConnectModal, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react'
import { ConnectComponentProps } from '../../../types'
import { TON } from '../../../icons'
import useInApp from '../../../hooks/useInApp'

const Connect: React.FC<ConnectComponentProps> = ({ children, className }) => {
    const { theme, pk, login, setIsAuthenticating, setCredential } = useInApp()

    const { open } = useTonConnectModal()
    const [tonConnectUI] = useTonConnectUI()
    const wallet = useTonWallet()

    async function connect() {
        if (wallet) {
            await Promise.all([
                tonConnectUI.disconnect(),
                storage.removeItem('access_token'),
                storage.removeItem('refresh_token'),
            ])
        }

        open()
    }

    useEffect(() => {
        if (!pk) return
        let sdk = new QuyxForUI(pk)

        tonConnectUI.uiOptions = {
            uiPreferences: {
                theme: theme === 'dark' ? THEME.DARK : THEME.LIGHT,
            },
        }

        tonConnectUI.setConnectRequestParameters({ state: 'loading' })
        ;(async function () {
            const token = await sdk.generatePayload()

            if (!token) {
                tonConnectUI.setConnectRequestParameters(null)
            } else {
                tonConnectUI.setConnectRequestParameters({
                    state: 'ready',
                    value: {
                        tonProof: token,
                    },
                })
            }
        })()

        tonConnectUI.onStatusChange(async (wallet) => {
            if (
                wallet &&
                wallet.connectItems?.tonProof &&
                'proof' in wallet.connectItems.tonProof
            ) {
                setIsAuthenticating(true)

                try {
                    const { accessToken, refreshToken } = await sdk.signIn(wallet)

                    sdk = new QuyxForUI(pk, {
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    })

                    const user = await sdk.whoami()
                    const credential = await sdk.getCredential(user?.did)
                    setCredential(credential)
                    login(user)
                } catch (e) {
                    console.error(e)
                    await tonConnectUI.disconnect()
                } finally {
                    setIsAuthenticating(false)
                }
            }
        })
    }, [pk])

    return children ? (
        <button onClick={connect} className={className}>
            {children}
        </button>
    ) : (
        <button onClick={connect} className={`btn ${className}`}>
            <TON size={19} />
            <div>Connect wallet</div>
        </button>
    )
}

export default Connect
