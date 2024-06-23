import React, { useState } from 'react'
import { CredentialBuilder } from '../../../types'
import { Loader, Plus } from '../../../icons'
import useInApp from '../../../hooks/useInApp'
import { getDefaultInputDate } from '../../../utils/helpers'

type Props = {
    builder: CredentialBuilder[]
    isLoading: boolean
    action?: string
    onSubmit: (data: Record<string, string>) => void
}

const CredentialFormBuilder: React.FC<Props> = ({ builder, onSubmit, isLoading, action }) => {
    const [values, setValues] = useState<Record<string, string>>({})
    const { usernames, credentialsCanExpire } = useInApp()

    const handleInputChange = (label: string, value: string) => {
        setValues((prev) => ({ ...prev, [label]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(values)
    }

    const renderInput = (item: CredentialBuilder) => {
        switch (item.input) {
            case 'text':
            case 'url':
                return item.label === 'username' ? (
                    <>
                        <select
                            value={(values[item.label] as string) || ''}
                            onChange={(e) => handleInputChange(item.label, e.target.value)}
                            id={item.label}
                            required
                        >
                            <option value="" disabled>
                                --choose username--
                            </option>

                            {usernames.map((username, i) => (
                                <option key={i} value={username}>
                                    {username}
                                </option>
                            ))}
                        </select>
                    </>
                ) : (
                    <input
                        type={item.input}
                        id={item.label}
                        autoComplete="off"
                        value={(values[item.label] as string) || ''}
                        onChange={(e) => handleInputChange(item.label, e.target.value)}
                        placeholder={`Enter ${item.label.split('_').join(' ')}`}
                        required
                    />
                )

            case 'textarea':
                return (
                    <textarea
                        value={(values[item.label] as string) || ''}
                        onChange={(e) => handleInputChange(item.label, e.target.value)}
                        placeholder={`Enter ${item.label.split('_').join(' ')}`}
                        required
                        rows={2.5}
                        id={item.label}
                    />
                )

            case 'image':
                return (
                    <input
                        type="file"
                        accept="image/*"
                        onChange={function (e) {
                            const file = e.target.files?.[0]
                            if (!file) return

                            const reader = new FileReader()
                            reader.onload = (ev: any) =>
                                handleInputChange(item.label, ev.target.result)
                            reader.readAsDataURL(file)
                        }}
                        required
                        id={item.label}
                    />
                )

            case 'select':
                return (
                    <select
                        value={(values[item.label] as string) || ''}
                        onChange={(e) => handleInputChange(item.label, e.target.value)}
                        id={item.label}
                        required
                    >
                        <option value="" disabled>
                            --choose {item.label.split('_').join(' ')}--
                        </option>

                        {item.options?.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                )

            default:
                return null
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {builder.map((item, index) => (
                <div key={index} className="form-grp">
                    {renderInput(item)}
                    <label htmlFor={item.label}>{item.label.split('_').join(' ')}</label>
                    {usernames.length == 0 && item.label === 'username' ? (
                        <p className="error">You don't have any username yet!</p>
                    ) : null}
                </div>
            ))}

            {credentialsCanExpire ? (
                <div className="form-grp">
                    <input
                        type="datetime-local"
                        onChange={(e) => handleInputChange('expires', e.target.value)}
                        id="expires"
                        defaultValue={getDefaultInputDate()}
                    />
                    <label htmlFor="expires">Expires (optional)</label>
                </div>
            ) : null}

            <button className="btn" type="submit" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Loader size={17} />
                        <div>{action || 'Loading'}</div>
                    </>
                ) : (
                    <>
                        <Plus />
                        <div>Create & Import</div>
                    </>
                )}
            </button>
        </form>
    )
}

export default CredentialFormBuilder
