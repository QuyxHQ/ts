import React, { useState } from 'react'
import useInApp from '../../../hooks/useInApp'
import { CustomAvatar } from '../..'
import { Cancel, Exchange, Loader, ArrowRight, Clock, Website, Copy, Check } from '../../../icons'
import { getAvatar, truncateAddress, getHumanReadableDateTIme } from '../../../utils/helpers'

type Props = {
    isLoading: boolean
    getUserCredentials: () => Promise<void>
}

const AcknowledgeRequestContent: React.FC<Props> = ({ isLoading, getUserCredentials }) => {
    const { space, closeImportModal, user } = useInApp()
    const [icon, setIcon] = useState<React.JSX.Element>()

    function copy() {
        if (!navigator.clipboard || !space) return
        navigator.clipboard.writeText(space.did)

        setIcon(<Check />)
        setTimeout(() => setIcon(undefined), 1500)
    }

    return (
        <>
            <div className="title">
                <h4>Acknowledge Request</h4>

                <button onClick={closeImportModal}>
                    <Cancel />
                </button>
            </div>

            <div className="body">
                <div className="user-to-space">
                    <img src={getAvatar(user?.pfp || null, user?.username!)} alt="" />

                    <Exchange size={40} />

                    <CustomAvatar id={space?._id!} size={4} name={space?.name} />
                </div>

                <div className="space-info">
                    <h3>{space?.name}</h3>
                    <p>
                        <span>{truncateAddress(space?.did!, 15, 8)}</span>
                        {icon ? icon : <Copy handleClick={copy} />}
                    </p>
                </div>

                <button className="btn" onClick={getUserCredentials} disabled={isLoading}>
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <>
                            <ArrowRight />
                            <div>Proceed</div>
                        </>
                    )}
                </button>

                <div className="more-space-info">
                    <div>
                        <Clock />

                        <div>
                            <p>Registered on</p>
                            <span>{getHumanReadableDateTIme(space?.createdAt!)}</span>
                        </div>
                    </div>

                    {space?.url ? (
                        <div>
                            <Website />

                            <div>
                                <p>Website</p>
                                <span>{space?.url}</span>
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="credits">
                    <span>Powered by &rarr;&nbsp;</span>
                    <a href="https://quyx.xyz" target="_blank">
                        Quyx
                    </a>
                </div>
            </div>
        </>
    )
}

export default AcknowledgeRequestContent
