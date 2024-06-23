import React, { useEffect, useState } from 'react'
import { storage, QuyxForUI } from '@quyx/sdk'
import { ConnectComponentProps, Credential } from '../../../types'
import { Import } from '../../../icons'
import useInApp from '../../../hooks/useInApp'
import AcknowledgeRequestContent from './AcknowledgeRequestContent'
import CredentialsContent from './CredentialsContent'

const ImportCredential: React.FC<ConnectComponentProps> = ({ children, className }) => {
    const { openImportModal, closeImportModal, displayImportModal, theme, pk } = useInApp()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isFetchingNextPage, setIsFetchingNextPage] = useState<boolean>(false)
    const [hasNextPage, setHasNextPage] = useState<boolean>(true)
    const [credentials, setCredentials] = useState<Credential[]>()
    const [page, setPage] = useState<number>(1)
    const limit = 15
    const [sdk, setSdk] = useState<QuyxForUI>()

    useEffect(() => {
        ;(async function () {
            if (!sdk || !credentials || page == 1 || isFetchingNextPage || !hasNextPage) return
            setIsFetchingNextPage(true)

            try {
                const { data, total } = await sdk.getUserCredentials({ page, limit })
                if (data.length === 0 || credentials.length >= total) setHasNextPage(false)

                setCredentials((prev) => (prev ? [...data, ...prev] : (data as any[])))
            } catch (e) {
                console.error(e)
            } finally {
                setIsFetchingNextPage(false)
            }
        })()
    }, [sdk, page, limit, credentials, isFetchingNextPage, hasNextPage])

    useEffect(() => {
        ;(async function () {
            if (!pk) return

            const [access_token, refresh_token] = await Promise.all([
                storage.getItem('access_token'),
                storage.getItem('refresh_token'),
            ])

            const sdk = new QuyxForUI(
                pk,
                access_token && refresh_token ? { access_token, refresh_token } : undefined
            )

            setSdk(sdk)
        })()
    }, [pk])

    function handleEsc(e: any) {
        if (e.keyCode === 27 && displayImportModal && displayImportModal) {
            closeImportModal()
        }
    }

    useEffect(() => {
        if (displayImportModal) document.body.classList.add('scroll-disabled')
        else document.body.classList.remove('scroll-disabled')

        if (displayImportModal) window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [displayImportModal])

    function handleOverlayClick(e: any) {
        if (e.target.classList.contains('modal')) closeImportModal()
        return
    }

    async function getUserCredentials() {
        if (!sdk || isLoading) return
        setIsLoading(true)

        try {
            const { data, total } = await sdk.getUserCredentials({ page, limit })
            if (data.length == total) setHasNextPage(false)

            setCredentials(data as any[])
        } catch (e) {
            alert('Oops! could not fetch credentials')
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div
                className="modal"
                style={displayImportModal ? { display: 'block' } : { display: 'none' }}
                onClick={handleOverlayClick}
            >
                <div className={`modal-box ${theme}`}>
                    {!credentials ? (
                        <AcknowledgeRequestContent
                            isLoading={isLoading}
                            getUserCredentials={getUserCredentials}
                        />
                    ) : (
                        <CredentialsContent
                            page={page}
                            isFetchingNextPage={isFetchingNextPage}
                            hasNextPage={hasNextPage}
                            credentials={credentials}
                            setPage={setPage}
                        />
                    )}
                </div>
            </div>

            {children ? (
                <button onClick={openImportModal} className={className}>
                    {children}
                </button>
            ) : (
                <button onClick={openImportModal} className={`btn ${className}`}>
                    <Import />
                    <div>Import credential</div>
                </button>
            )}
        </>
    )
}

export default ImportCredential
