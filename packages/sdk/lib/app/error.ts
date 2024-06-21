type ErrorIdentifier =
    | 'INTERNAL_ERROR'
    | 'BAD_REQUEST'
    | 'UNAUTHORIZED'
    | 'UNKNOWN_ERROR'
    | 'FORBIDDEN'

type QuyxErrorProps = {
    identifier: ErrorIdentifier
    message: string
    metadata?: any
}

export default class QuyxError extends Error {
    identifier: ErrorIdentifier
    message: string
    metadata?: any

    constructor({ identifier, message, metadata }: QuyxErrorProps) {
        super()
        this.identifier = identifier
        this.message = message
        this.metadata = metadata
    }
}
