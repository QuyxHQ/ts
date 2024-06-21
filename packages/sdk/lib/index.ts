import QuyxAPIClass from './app/adapter'
import ApiClient from './app/adapter/api.client'
import constants from './app/constants'

export class Quyx extends QuyxAPIClass {
    constructor(sk: string) {
        super(new ApiClient({ keys: { sk } }))
    }
}

export class QuyxForUI extends QuyxAPIClass {
    constructor(pk: string, tokens?: { access_token: string; refresh_token: string }) {
        super(new ApiClient({ tokens, keys: { pk } }))
    }
}

export const storage = constants.STORAGE
