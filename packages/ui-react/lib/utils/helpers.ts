import { format, parseISO } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { Address } from 'ton-core'
import axios from 'axios'
import { CredentialBuilder } from '../types'
import constants from './constants'

export function getDefaultInputDate() {
    const now = new Date()
    const futureDate = new Date(now.getTime() + 1 * 60 * 60 * 1000)

    const year = futureDate.getFullYear()
    const month = String(futureDate.getMonth() + 1).padStart(2, '0')
    const day = String(futureDate.getDate()).padStart(2, '0')
    const hours = String(futureDate.getHours()).padStart(2, '0')
    const minutes = String(futureDate.getMinutes()).padStart(2, '0')

    return `${year}-${month}-${day}T${hours}:${minutes}`
}

export async function getUsernames(address: string) {
    const addr = Address.parse(address).toRawString()
    const ca = Address.parse(constants.CONTRACT_ADDRESS)

    const query = `
        query AllGetNftData {
          allGetNftData(
            condition: {
              ownerRawAddress: "${addr}",
              collectionRawAddress: "${ca}"
            }
          ) {
            nodes {
              index
              individualContent
              url
            }
          }
        }
      `

    try {
        const response = await axios.post(
            constants.GRAPHQL_ENDPOINT,
            { query },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

        const data = response.data.data.allGetNftData.nodes

        const usernames = data.map((node: any) => {
            const parts = node.url.split('/')
            return parts[parts.length - 1]
        })

        return usernames as string[]
    } catch (e) {
        console.log(e)
        return undefined
    }
}

export function getAvatar(pfp: string | null, username: string) {
    if (pfp) return pfp
    return `https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=${username}`
}

export function truncateAddress(address: string, prefixLength = 5, suffixLength = 4) {
    if (address.length <= prefixLength + suffixLength) return address

    const prefix = address.slice(0, prefixLength)
    const suffix = address.slice(-suffixLength)
    const truncated = `${prefix}....${suffix}`

    return truncated
}

export function getHumanReadableDateTIme(date: string) {
    return format(parseISO(date), 'EEEE do MMMM, yyyy', {
        locale: enUS,
    })
}

function isValidUrl(string: string) {
    try {
        new URL(string)
        return true
    } catch (_) {
        return false
    }
}

export function validateCredentialStructure(
    format: CredentialBuilder[],
    input: Record<string, any>
) {
    const errors: string[] = []

    format.forEach((field) => {
        const value = input[field.label]

        if (value === undefined) {
            errors.push(`Missing field: ${field.label}`)
            return
        }

        switch (field.input) {
            case 'text':
            case 'textarea':
                if (typeof value !== 'string') {
                    errors.push(`${field.label} should be a string`)
                }

                break

            case 'url':
                if (typeof value !== 'string' || !isValidUrl(value)) {
                    errors.push(`${field.label} should be a valid URL`)
                }

                break

            case 'select':
                if (!field.options?.includes(value)) {
                    errors.push(`${field.label} should be one of: ${field.options?.join(', ')}`)
                }

                break
        }
    })

    return {
        isValid: errors.length === 0,
        errors,
    }
}
