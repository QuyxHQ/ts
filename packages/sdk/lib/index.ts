import QuyxAPIClass from './app/adapter'
import ApiClient from './app/adapter/api.client'

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
