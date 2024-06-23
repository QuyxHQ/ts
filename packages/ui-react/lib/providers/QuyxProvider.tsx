import React, { createContext, useEffect, useState, useReducer } from 'react'
import { useIsConnectionRestored, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react'
import { QuyxForUI, storage } from '@quyx/sdk'
import { Credential, CredentialBuilder, QuyxProviderProps, Space, THEME, User } from '../types'
import { getUsernames } from '../utils/helpers'

const initialState = { user: undefined, credential: undefined }

type QuyxProviderContextProps = {
    pk?: string
    space?: Space
    user?: User
    credential?: Credential
    credentialFormat?: CredentialBuilder[]
    isMounting: boolean
    theme: THEME
    isAuthenticating: boolean
    displayImportModal: boolean
    credentialsCanExpire: boolean
    usernames: string[]
    openImportModal: () => void
    closeImportModal: () => void
    login: (user: User) => void
    logout: () => void
    setCredential: (credential: Credential) => void
    setIsAuthenticating: React.Dispatch<React.SetStateAction<boolean>>
}

export const QuyxProviderContext = createContext<QuyxProviderContextProps>({
    isMounting: true,
    theme: 'light',
    isAuthenticating: false,
    displayImportModal: false,
    credentialsCanExpire: true,
    usernames: [],
    openImportModal() {},
    closeImportModal() {},
    login() {},
    logout() {},
    setCredential() {},
    setIsAuthenticating() {},
})

function reducer(state: any, action: { type: string; payload?: any }) {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, user: action.payload }

        case 'UPDATE_CREDENTIAL':
            return { ...state, credential: action.payload }

        case 'LOGOUT':
            return { ...state, user: undefined, credential: undefined }

        default:
            return state
    }
}

const QuyxProvider: React.FC<QuyxProviderProps> = (props) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [isMounting, setIsMounting] = useState<boolean>(true)
    const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false)
    const [pk, setPk] = useState<string>()
    const [usernames, setUsernames] = useState<string[]>([])
    const [space, setSpace] = useState<Space>()
    const [theme, setTheme] = useState<THEME>('light')
    const [displayImportModal, setDisplayImportModal] = useState<boolean>(false)
    const isConnectionRestored = useIsConnectionRestored()
    const wallet = useTonWallet()
    const [tonConnectUI] = useTonConnectUI()

    useEffect(() => {
        ;(async function () {
            if (isMounting || !isConnectionRestored || isAuthenticating) return

            if (state.user && !wallet) {
                await Promise.all([storage.removeItem('access_token'), storage.removeItem('refresh_token')])

                logout()
            }

            if (wallet && !state.user) await tonConnectUI.disconnect()
        })()
    }, [wallet, isConnectionRestored, state, isMounting, isAuthenticating])

    useEffect(() => {
        const media = window.matchMedia('(prefers-color-scheme: dark)')
        setTheme(media.matches ? 'dark' : 'light')

        const fn = (e: any) => setTheme(e.matches ? 'dark' : 'light')
        media.addEventListener('change', fn)
        return () => media.removeEventListener('change', fn)
    }, [])

    async function getCredential(sdk: QuyxForUI, did: string) {
        const credential = await sdk.getCredential(did as any)
        if (credential) {
            await storage.setItem('credential', JSON.stringify(credential))
        }

        dispatch({
            type: 'UPDATE_CREDENTIAL',
            payload: credential ? credential : undefined,
        })
    }

    useEffect(() => {
        ;(async function () {
            if (!props.pk) return

            setIsMounting(true)
            setPk(props.pk)
            setTheme(props.theme ? props.theme : 'light')

            try {
                const [access_token, refresh_token] = await Promise.all([
                    storage.getItem('access_token'),
                    storage.getItem('refresh_token'),
                ])

                const sdk = new QuyxForUI(
                    props.pk,
                    access_token && refresh_token ? { access_token, refresh_token } : undefined
                )

                let [user, space, credential] = await Promise.all([
                    sdk.whoami(),
                    sdk.mySpace(),
                    storage.getItem('credential'),
                ])

                login(user)
                setSpace(space)

                dispatch({
                    type: 'UPDATE_CREDENTIAL',
                    payload: credential ? JSON.parse(credential) : undefined,
                })

                const [usernames] = await Promise.all([
                    getUsernames(user.address),
                    getCredential(sdk, user.did),
                ])

                setUsernames(usernames || [])
            } catch (e: any) {
                console.error(e)
            } finally {
                setIsMounting(false)
            }
        })()
    }, [props])

    const login = (user: User) => dispatch({ type: 'LOGIN', payload: user })

    const logout = () => dispatch({ type: 'LOGOUT' })

    const setCredential = (credential: Credential) => {
        dispatch({ type: 'UPDATE_CREDENTIAL', payload: credential })
    }

    const openImportModal = () => setDisplayImportModal(true)
    const closeImportModal = () => setDisplayImportModal(false)

    return (
        <QuyxProviderContext.Provider
            value={{
                theme,
                pk,
                space,
                user: state.user,
                credential: state.credential,
                isMounting,
                isAuthenticating,
                displayImportModal,
                credentialFormat: props.credentialFormat,
                credentialsCanExpire: props.credentialsCanExpire ?? true,
                usernames,
                openImportModal,
                closeImportModal,
                login,
                logout,
                setCredential,
                setIsAuthenticating,
            }}
        >
            <main className="quyx-root">{props.children}</main>
        </QuyxProviderContext.Provider>
    )
}

export default QuyxProvider
