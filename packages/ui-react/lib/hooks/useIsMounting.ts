import useInApp from './useInApp'

export default function () {
    const { isMounting } = useInApp()
    return isMounting
}
