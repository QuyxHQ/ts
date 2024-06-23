type Base = {
    readonly _id: string
    createdAt: string
    updatedAt: string
}

export type DID = `did:key:${string}`

export interface User extends Base {
    username: string
    hasBlueTick: boolean
    address: string
    did: DID
    pfp?: string | null
}

export interface Space extends Base {
    name: string
    did: DID
    url?: string | null
    isActive: boolean
}

export interface SignInResponse {
    accessToken: string
    refreshToken: string
}

type URLResponseObject = { gateway: string; ipfs: string }

export interface IssueVCProps {
    payload: Record<string, any>
    expires?: number
}

export interface IssueVCResponse {
    jwt: string
    hash: string
    urls: URLResponseObject
}

type Extensible<T> = T & { [x: string]: any }
type Replace<T, U> = Omit<T, keyof U> & U

export interface Proof {
    type?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: any
}

export type IssuerType = Extensible<{ id: string }> | string
export type DateType = string | Date

export interface CredentialStatus {
    id: string
    type: string
}

interface NarrowCredentialDefinitions {
    '@context': string[]
    type: string[]
    issuer: Exclude<IssuerType, string>
    issuanceDate: string
    expirationDate?: string
}

interface FixedCredentialPayload {
    '@context': string | string[]
    id?: string
    type: string | string[]
    issuer: IssuerType
    issuanceDate: DateType
    expirationDate?: DateType
    credentialSubject: Extensible<{
        id?: string
    }>
    credentialStatus?: CredentialStatus
    evidence?: any
    termsOfUse?: any
}

export type Verifiable<T> = Readonly<T> & { readonly proof: Proof }
export type W3CCredential = Extensible<Replace<FixedCredentialPayload, NarrowCredentialDefinitions>>

export interface Credential {
    credential: Verifiable<W3CCredential>
    subject: DID
    jwt: string
    revoked: boolean
    spaces: DID[]
}

export type Paginate<T> = {
    page: number
    limit: number
    total: number
    data: T[]
}

export interface PaginateRequest {
    page?: number
    limit?: number
    revalidate?: 'yes' | 'no'
}
