import { omit } from 'lodash'
import ApiClient from './api.client'
import { AsyncLocalStorage } from '../async.storage'
import constants from '../constants'
import QuyxError from '../error'
import {
    Credential,
    DID,
    IssueVCProps,
    IssueVCResponse,
    Paginate,
    PaginateRequest,
    SignInResponse,
    Space,
    User,
    Verifiable,
    W3CCredential,
} from '../types'

export default class QuyxAPIClass {
    private storage?: AsyncLocalStorage

    constructor(private client: ApiClient) {
        this.storage = constants.STORAGE
    }

    /**
     * Generates a payload to use for ton connect
     * @returns {string} returns the payload
     **/
    async generatePayload(): Promise<string | undefined> {
        const { data } = await this.client.getInstanceWithoutAuth().get('/auth/token')
        return (data.data.token as string) || undefined
    }

    /**
     * Signs the user in to Quyx service
     * @param  {Object} walletInfo - returned after passing connecting the users wallet
     * @returns {SignInResponse} returns the user access & refresh token
     **/
    async signIn(walletInfo: Record<string, any>): Promise<SignInResponse> {
        const response = await this.client.getInstanceWithoutAuth().post('/auth', { walletInfo })

        if (response.error) {
            if (response.code === 400) {
                throw new QuyxError({
                    identifier: 'BAD_REQUEST',
                    message: response.data.error || 'Could not complete request',
                    metadata: response,
                })
            }

            if (response.code === 409) {
                throw new QuyxError({
                    identifier: 'INTERNAL_ERROR',
                    message: response.data.error || 'Could not complete request',
                    metadata: response,
                })
            }

            if (response.code === 500) {
                throw new QuyxError({
                    identifier: 'INTERNAL_ERROR',
                    message: response.data.error || 'Could not complete request',
                    metadata: response,
                })
            }

            throw new QuyxError({
                identifier: 'UNKNOWN_ERROR',
                message: 'Could not complete request',
                metadata: response,
            })
        }

        const { accessToken, refreshToken } = response.data.data

        if (this.storage) {
            await Promise.all([
                this.storage.setItem('access_token', accessToken),
                this.storage.setItem('refresh_token', refreshToken),
            ])
        }

        return { accessToken, refreshToken }
    }

    /**
     * Gets basic information about user from Quyx
     * @returns {User} returns the user data
     **/
    async whoami(): Promise<User> {
        const response = await this.client.getInstance().get('/user/whoami')
        if (response.error) {
            if (response.code === 401) {
                throw new QuyxError({
                    identifier: 'UNAUTHORIZED',
                    message: response.data.error || 'You are not authorized to perform this action',
                    metadata: response,
                })
            }

            throw new QuyxError({
                identifier: 'UNKNOWN_ERROR',
                message: 'Could not complete request',
                metadata: response,
            })
        }

        const user = response.data.data
        return omit(user, ['tg', 'socials', 'pending_usernames', 'bio']) as User
    }

    /**
     * Gets basic information about space
     * @returns {Space} returns the space data
     **/
    async mySpace(): Promise<Space> {
        const response = await this.client.getInstance().get('/space/space-info')
        if (response.error) {
            if (response.code === 401) {
                throw new QuyxError({
                    identifier: 'UNAUTHORIZED',
                    message: response.data.error || 'You are not authorized to perform this action',
                    metadata: response,
                })
            }

            throw new QuyxError({
                identifier: 'UNKNOWN_ERROR',
                message: 'Could not complete request',
                metadata: response,
            })
        }

        const space = response.data.data
        return omit(space, ['owner', 'keys']) as Space
    }

    /**
     * Issues credential to a user
     * @param  {IssueVCProps} props
     * @returns {IssueVCResponse} returns information about the issued credential
     **/
    async issueCredential({ payload, expires }: IssueVCProps): Promise<IssueVCResponse> {
        const response = await this.client
            .getInstance()
            .post('/identity/issue-vc', { payload, expires })

        if (response.error) {
            if (response.code === 403) {
                throw new QuyxError({
                    identifier: 'FORBIDDEN',
                    message: response.data.error || 'User not found to own the provided username',
                    metadata: response,
                })
            }

            if (response.code === 409) {
                throw new QuyxError({
                    identifier: 'INTERNAL_ERROR',
                    message: response.data.error || 'Could not complete request',
                    metadata: response,
                })
            }

            throw new QuyxError({
                identifier: 'INTERNAL_ERROR',
                message: response.data.error || 'Could not complete request',
                metadata: response,
            })
        }

        return response.data.data
    }

    /**
     * Verifies a credential
     * @param  {string} jwt
     * @returns {Verifiable<W3CCredential>} returns information about the verified credential
     **/
    async verifyCredential(jwt: string): Promise<Verifiable<W3CCredential>> {
        const response = await this.client.getInstance().post('/identity/verify-vc', { jwt })

        if (response.error) {
            throw new QuyxError({
                identifier: 'INTERNAL_ERROR',
                message: response.data.error || 'Could not complete request',
                metadata: response,
            })
        }

        return response.data.data
    }

    /**
     * Gives space access to user credential
     * @param  {string} credentialHash
     * @returns {boolean}
     **/
    async permitSpace(credentialHash: string): Promise<boolean> {
        const response = await this.client.getInstance().put(`/identity/permit/${credentialHash}`)

        if (response.error) {
            throw new QuyxError({
                identifier: 'INTERNAL_ERROR',
                message: response.data.error || 'Could not complete request',
                metadata: response,
            })
        }

        return true
    }

    /**
     * Gets all the of the user credentials on Quyx
     * @param  {PaginateRequest} props
     * @returns {Paginate<Credential>}
     **/
    async getUserCredentials(props: PaginateRequest): Promise<Paginate<Credential>> {
        props.page = props.page ? props.page : 1
        props.limit = props.limit ? props.limit : 30
        props.revalidate = props.revalidate ? props.revalidate : 'no'

        const response = await this.client
            .getInstance()
            .get(
                `/identity/user?page=${props.page}&limit=${props.limit}&revalidate=${props.revalidate}`
            )

        if (response.error) {
            if (response.code === 401) {
                throw new QuyxError({
                    identifier: 'UNAUTHORIZED',
                    message: response.data.error || 'You are not authorized to perform this action',
                    metadata: response,
                })
            }

            if (response.code === 409) {
                throw new QuyxError({
                    identifier: 'INTERNAL_ERROR',
                    message: response.data.error || 'Could not complete request',
                    metadata: response,
                })
            }

            throw new QuyxError({
                identifier: 'INTERNAL_ERROR',
                message: response.data.error || 'Could not complete request',
                metadata: response,
            })
        }

        return response.data.data as Paginate<Credential>
    }

    /**
     * Gets all credentials a space has access to
     * @param  {PaginateRequest} props
     * @returns {Paginate<any>}
     **/
    async getCredentials(props: PaginateRequest): Promise<Paginate<any>> {
        props.page = props.page ? props.page : 1
        props.limit = props.limit ? props.limit : 30
        props.revalidate = props.revalidate ? props.revalidate : 'no'

        const response = await this.client
            .getInstance()
            .get(`/identity?page=${props.page}&limit=${props.limit}&revalidate=${props.revalidate}`)

        if (response.error) {
            if (response.code === 401) {
                throw new QuyxError({
                    identifier: 'UNAUTHORIZED',
                    message: response.data.error || 'You are not authorized to perform this action',
                    metadata: response,
                })
            }

            if (response.code === 409) {
                throw new QuyxError({
                    identifier: 'INTERNAL_ERROR',
                    message: response.data.error || 'Could not complete request',
                    metadata: response,
                })
            }

            throw new QuyxError({
                identifier: 'INTERNAL_ERROR',
                message: response.data.error || 'Could not complete request',
                metadata: response,
            })
        }

        return response.data.data as Paginate<any>
    }

    /**
     * Gives space access to user credential
     * @param  {string} param - user did or address
     * @returns {any}
     **/
    async getCredential(param: string): Promise<any> {
        const response = await this.client.getInstance().get(`/identity/user/${param}`)
        return response.data.data
    }

    /**
     * Uploads an image
     * @param  {string} base64image
     * @returns {string|null} the image url
     **/
    async uploadImage(base64image: string): Promise<string | null> {
        const { error, data } = await this.client
            .getInstance()
            .post('/misc/upload', { image: base64image.split(',')[1] })

        if (error) return null
        return (data?.data.uri as string) ?? null
    }

    /**
     * Deletes session of the current user
     * @returns {boolean}
     **/
    async logout(): Promise<boolean> {
        const { error, data } = await this.client.getInstance().delete('/session/current')

        if (error) return false

        const { acknowledged, modifiedCount } = data.data.data
        if (!acknowledged || modifiedCount == 0) return false

        if (this.storage) {
            await Promise.all([
                this.storage.removeItem('access_token'),
                this.storage.removeItem('refresh_token'),
            ])
        }

        return true
    }
}
