import React, { useState } from 'react'
import { omit } from 'lodash'
import JsonView from 'react18-json-view'
import { sha256 } from 'ton-crypto'
import { QuyxForUI, storage } from '@quyx/sdk'
import 'react18-json-view/src/style.css'
import { Credential } from '../../../types'
import { Cancel, CredentialIcon, Import, Loader, MoodPuzzled, Plus } from '../../../icons'
import useInApp from '../../../hooks/useInApp'
import { validateCredentialStructure } from '../../../utils/helpers'
import CreateCredentialContent from './CreateCredentialContent'

type Props = {
    page: number
    isFetchingNextPage: boolean
    hasNextPage: boolean
    credentials: Credential[]
    setPage: React.Dispatch<React.SetStateAction<number>>
}

const CredentialsContent: React.FC<Props> = ({
    page,
    isFetchingNextPage,
    hasNextPage,
    credentials,
    setPage,
}) => {
    const { closeImportModal, pk, setCredential, user, credentialFormat, credentialsCanExpire } = useInApp()
    const [selectedIndex, setSelectedIndex] = useState<number>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [errors, setErrors] = useState<string[]>([])
    const [displayAddCreedScreen, setDisplayAddCreedSCreen] = useState<boolean>(false)

    async function importCreeds() {
        if (selectedIndex == undefined || isLoading || !pk) return

        const creed = credentials[selectedIndex]

        if (!credentialsCanExpire && typeof creed.credential.expirationDate === 'string') {
            return setErrors(['Expirable credential not allowed'])
        }

        if (credentialFormat) {
            const { errors, isValid } = validateCredentialStructure(
                credentialFormat,
                creed.credential.credentialSubject
            )

            if (!isValid) return setErrors(errors)
        }

        setIsLoading(true)

        try {
            const [access_token, refresh_token] = await Promise.all([
                storage.getItem('access_token'),
                storage.getItem('refresh_token'),
            ])

            const sdk = new QuyxForUI(
                pk,
                access_token && refresh_token ? { access_token, refresh_token } : undefined
            )

            const hash = await sha256(credentials[selectedIndex].jwt)
            const res = await sdk.permitSpace(hash.toString('hex'))
            if (res) {
                const credential = await sdk.getCredential(user?.did!)
                setCredential(credential)
            }
        } catch (e: any) {
            alert('Could not complete request!')
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    return displayAddCreedScreen ? (
        <CreateCredentialContent setDisplayAddCreedSCreen={setDisplayAddCreedSCreen} />
    ) : (
        <>
            <div className="title">
                <h4>Import Credential</h4>

                <button onClick={closeImportModal}>
                    <Cancel />
                </button>
            </div>

            <div className="body">
                <div className="credentials-body">
                    {credentials.length == 0 ? (
                        <div className="empty">
                            <MoodPuzzled size={60} />
                            <p>You don't have any credential at the moment</p>

                            <button className="btn" onClick={() => setDisplayAddCreedSCreen(true)}>
                                <Plus size={21} />
                                <div>Create one</div>
                            </button>
                        </div>
                    ) : (
                        <div className="credentials">
                            <div className="header">
                                <CredentialIcon size={50} />
                            </div>

                            <select
                                name="credential"
                                id="credential"
                                defaultValue=""
                                onChange={(e) => setSelectedIndex(Number(e.target.value))}
                            >
                                <option value="" disabled>
                                    --choose credential--
                                </option>

                                {credentials.map((_, i) => (
                                    <option key={`credential-${i}`} value={i}>
                                        Credential - #{i + 1}
                                    </option>
                                ))}
                            </select>

                            <div className="helper">
                                <div>
                                    <button onClick={() => setPage(page + 1)} disabled={!hasNextPage}>
                                        load more
                                    </button>

                                    <button onClick={() => setDisplayAddCreedSCreen(true)}>
                                        <Plus size={20} />
                                    </button>
                                </div>

                                {isFetchingNextPage ? <Loader /> : null}
                            </div>

                            <div className="preview">
                                <div className="preview-title">
                                    <hr />
                                    <h4>Preview</h4>
                                </div>

                                <div className="json">
                                    {typeof selectedIndex !== 'undefined' ? (
                                        <JsonView
                                            src={omit(
                                                credentials[selectedIndex].credential.credentialSubject,
                                                ['id', 'address']
                                            )}
                                            enableClipboard={false}
                                            displaySize={false}
                                            collapsed={true}
                                            style={{ lineHeight: '160%', fontSize: '0.95rem' }}
                                        />
                                    ) : (
                                        <p className="empty-p">Choose a credential to preview</p>
                                    )}
                                </div>
                            </div>

                            {errors.length > 0 ? (
                                <div className="errors">
                                    <p>
                                        {errors[0]}&nbsp;
                                        {errors.length - 1 > 0 ? ` +${errors.length - 1} more` : null}
                                    </p>
                                </div>
                            ) : null}

                            <button
                                className="btn"
                                disabled={selectedIndex == undefined || isLoading}
                                onClick={importCreeds}
                            >
                                {isLoading ? (
                                    <Loader />
                                ) : (
                                    <>
                                        <Import />
                                        <div>Import</div>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                <div className="credits">
                    <span>Powered by &rarr;&nbsp;</span>
                    <a href="https://quyx.xyz" target="_blank">
                        Quyx
                    </a>
                </div>
            </div>
        </>
    )
}

export default CredentialsContent
