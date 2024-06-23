import useInApp from './useInApp'

export default function () {
    const { credential } = useInApp()
    return credential
}
