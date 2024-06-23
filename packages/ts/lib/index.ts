import { Quyx } from '@quyx/sdk'
import { Space, Verifiable, W3CCredential } from '@quyx/sdk/dist/app/types'

/**
 * @class QuyxSdk
 * @description Main SDK class for Quyx integration
 */
export default class QuyxSdk {
    identity: Identity
    space: SpaceSdk

    /**
     * @constructor
     * @param {Object} params - Constructor parameters
     * @param {string} params.sk - Space secret key(sk)
     */
    constructor({ sk }: { sk: string }) {
        const client = new Quyx(sk)

        this.identity = new Identity(client)
        this.space = new SpaceSdk(client)
    }
}

/**
 * @class Identity
 * @description Handles identity-related operations
 */
class Identity {
    /**
     * @constructor
     * @param {Quyx} client - Quyx client instance
     */
    constructor(private client: Quyx) {}

    /**
     * @function verify
     * @description Verifies a JWT credential
     * @param {Object} params - Function parameters
     * @param {string} params.jwt - JWT to verify
     * @returns {Promise<Verifiable<W3CCredential>>} Verification result
     */
    async verify({ jwt }: { jwt: string }): Promise<Verifiable<W3CCredential>> {
        return await this.client.verifyCredential(jwt)
    }
}

/**
 * @class Space
 * @description Manages space-related operations
 */
class SpaceSdk {
    users: Users

    /**
     * @constructor
     * @param {Quyx} client - Quyx client instance
     */
    constructor(private client: Quyx) {
        this.users = new Users(this.client)
    }

    /**
     * @function info
     * @description Retrieves information about the current space
     * @returns {Promise<Space>} Space information
     */
    async info(): Promise<Space> {
        return await this.client.mySpace()
    }
}

/**
 * @class Users
 * @description Handles user-related operations within a space
 */
class Users {
    /**
     * @constructor
     * @param {Quyx} client - Quyx client instance
     */
    constructor(private client: Quyx) {}

    /**
     * @function single
     * @description Retrieves a single user's credential by address
     * @param {string} address - User's address
     * @returns {Promise<any>} User's credential
     */
    async single(address: string): Promise<any> {
        return await this.client.getCredential(address)
    }

    /**
     * @function all
     * @description Retrieves multiple user credentials with pagination
     * @param {Object} [props] - Function parameters
     * @param {number} [props.limit=20] - Number of results per page
     * @param {number} [props.page=1] - Page number
     * @returns {Promise<Paginate<any>>} Paginated user credentials
     */
    async all(props?: { limit?: number; page?: number }) {
        props.limit = props.limit ? props.limit : 20
        props.page = props.page ? props.page : 1

        return await this.client.getCredentials({ limit: props.limit, page: props.page })
    }
}
