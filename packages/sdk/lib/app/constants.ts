import { createAsyncLocalStorage } from './async.storage'
import { isBrowser } from './helper'

const ENDPOINT_URL = 'https://api.quyx.xyz'
const STORAGE = isBrowser() ? createAsyncLocalStorage('storage') : undefined

export default { ENDPOINT_URL, STORAGE }
