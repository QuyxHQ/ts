import { AxiosError, AxiosResponse } from 'axios'
import { HttpClient } from './http.util'
import constants from '../constants'

export default class ApiClient extends HttpClient {
    constructor(options: {
        tokens?: { access_token: string; refresh_token: string }
        keys: { pk?: string; sk?: string }
    }) {
        super({
            baseURL: constants.ENDPOINT_URL,
            headers: {
                accept: 'application/json',
                ...(options.tokens
                    ? {
                          Authorization: `Bearer ${options.tokens.access_token}`,
                          'X-Refresh': options.tokens.refresh_token,
                      }
                    : {}),
                ...(options.keys.pk ? { 'quyx-pk': options.keys.pk } : {}),
                ...(options.keys.sk ? { 'quyx-sk': options.keys.sk } : {}),
                'content-type': 'application/json',
            },
        })
    }

    async _handleResponse({ data, status: statusCode, headers }: AxiosResponse<any>) {
        const newAccessToken = headers['x-access-token']
        if (newAccessToken && constants.STORAGE) {
            await constants.STORAGE.setItem('access_token', newAccessToken)
        }

        if (data.data && 'status' in data.data && !data.data.status) {
            return { error: true, code: statusCode, data }
        }

        return { error: false, code: statusCode, data }
    }

    _handleError(error: AxiosError<any>) {
        const response = {
            error: true,
            code: error.response?.status,
            data: error.response?.data,
        }

        return response
    }

    getInstance() {
        return this.instance
    }

    getInstanceWithoutAuth() {
        return this.instanceWithoutAuth
    }
}
