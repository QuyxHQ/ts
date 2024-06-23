import useInApp from './useInApp'

export default function () {
    const { openImportModal, closeImportModal, displayImportModal } = useInApp()

    return {
        open: openImportModal,
        close: closeImportModal,
        state: displayImportModal ? 'opened' : 'closed',
    }
}
