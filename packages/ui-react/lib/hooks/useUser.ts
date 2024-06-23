import useInApp from './useInApp'

export default function () {
    const { user } = useInApp()
    return user
}
