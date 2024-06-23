import React, { useState } from 'react'
import { storage, QuyxForUI } from '@quyx/sdk'
import { omit } from 'lodash'
import useInApp from '../../../hooks/useInApp'
import { ArrowLeft, Cancel } from '../../../icons'
import CredentialFormBuilder from './CredentialFormBuilder'

type Props = {
    setDisplayAddCreedSCreen: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateCredentialContent: React.FC<Props> = ({ setDisplayAddCreedSCreen }) => {
    const { closeImportModal, credentialFormat, pk, user, setCredential } = useInApp()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [action, setAction] = useState<string>()

    async function createCredential(data: Record<string, any>) {
        if (!pk || isLoading) return
        setIsLoading(true)

        const expires = data.expires ? new Date(data.expires).getTime() : undefined

        data = omit(data, 'expires')

        const [access_token, refresh_token] = await Promise.all([
            storage.getItem('access_token'),
            storage.getItem('refresh_token'),
        ])

        const sdk = new QuyxForUI(
            pk,
            access_token && refresh_token ? { access_token, refresh_token } : undefined
        )

        try {
            for (const key in data) {
                if (data[key].startsWith('data:image/')) {
                    setAction('Uploading image')

                    const url = await sdk.uploadImage(data[key])
                    if (!url) {
                        alert('Could not upload image')
                        setIsLoading(false)

                        return
                    }

                    data[key] = url
                }
            }

            setAction('Issuing credential')
            const credential = await sdk.issueCredential({ payload: data, expires })

            setAction('Permitting space')
            const res = await sdk.permitSpace(credential.hash)
            if (res) {
                setAction('Finalizing sync')
                const credential = await sdk.getCredential(user?.did!)
                setCredential(credential)
            }
        } catch (e: any) {
            alert('Could not complete action')
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className="title">
                <button onClick={() => setDisplayAddCreedSCreen(false)} className="back">
                    <ArrowLeft />
                </button>

                <h4>Create Credential</h4>

                <button onClick={closeImportModal}>
                    <Cancel />
                </button>
            </div>

            <div className="body">
                <div className="credentials-form">
                    {credentialFormat ? (
                        <CredentialFormBuilder
                            builder={credentialFormat}
                            onSubmit={createCredential}
                            isLoading={isLoading}
                            action={action}
                        />
                    ) : (
                        <CredentialFormBuilder
                            builder={[
                                {
                                    label: 'username',
                                    input: 'text',
                                },
                                {
                                    label: 'pfp',
                                    input: 'image',
                                },
                                {
                                    label: 'short_bio',
                                    input: 'textarea',
                                },
                            ]}
                            onSubmit={createCredential}
                            isLoading={isLoading}
                            action={action}
                        />
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

export default CreateCredentialContent
