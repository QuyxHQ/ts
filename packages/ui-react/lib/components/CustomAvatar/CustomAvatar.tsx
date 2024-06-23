import React from 'react'

type Props = {
    id: string
    size?: number
    className?: string
    name?: string
}

const CustomAvatar: React.FC<Props> = ({ id, size, className, name }) => {
    const colors = [
        '#e0f2fe', // bg-teal-200
        '#fecdd3', // bg-red-200
        '#d9f99d', // bg-green-200
        '#e9d8fd', // bg-purple-200
        '#bfdbfe', // bg-blue-200
        '#fef08a', // bg-yellow-200
        '#fdba74', // bg-orange-200
        '#fbcfe8', // bg-pink-200
        '#f0abfc', // bg-fuchsia-200
        '#fecdd3', // bg-rose-200
    ]

    const index = parseInt(id.substring(10), 16) % colors.length
    const color = colors[index]

    return (
        <div
            style={{
                height: `${size}rem`,
                width: `${size}rem`,
                backgroundColor: color,
            }}
            className={`custom-avatar ${className}`}
        >
            <span>{name ? name.charAt(0).toUpperCase() : '?'}</span>
        </div>
    )
}

export default CustomAvatar
