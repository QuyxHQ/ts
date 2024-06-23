import { useContext } from 'react'
import { QuyxProviderContext } from '../providers/QuyxProvider'

export default function () {
    const context = useContext(QuyxProviderContext)
    if (!context) throw new Error('useInApp must be used within a QuyxProvider')

    return context
}
