import React from 'react'

export type CredentialBuilder = {
    label: string
    input: 'text' | 'textarea' | 'image' | 'url' | 'select'
    options?: string[]
}

export type THEME = 'light' | 'dark'

type Base = {
    readonly _id: string
    createdAt: string
    updatedAt: string
}

export interface User extends Base {
    username: string
    hasBlueTick: boolean
    address: string
    did: DID
    pfp?: string | null
}

export type DID = `did:key:${string}`

export interface Credential {
    subject: DID
    jwt: string
    revoked: boolean
    spaces: DID[]
    credential: {
        credentialSubject: {
            id: DID
            address: string
            [key: string]: string
        }
        issuer: {
            id: DID
        }
        type: ['VerifiableCredential']
        '@context': ['https://www.w3.org/2018/credentials/v1']
        issuanceDate: string
        expirationDate?: string
        proof: { type: 'JwtProof2020'; jwt: string }
    }
}

export interface Space extends Base {
    name: string
    did: DID
    url?: string | null
    isActive: boolean
}

export interface QuyxProviderProps {
    children: React.ReactNode
    pk: string
    credentialFormat?: CredentialBuilder[]
    theme?: THEME
    credentialsCanExpire?: boolean
}

export interface IconProps {
    size?: number
    className?: string
    fill?: string
    handleClick?: () => void
}

export interface ConnectComponentProps {
    children?: React.ReactNode
    className?: string
}
