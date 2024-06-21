import { Quyx, QuyxForUI } from '..'
;(async function () {
    const sk = ''
    const pk = ''
    const tokens = { access_token: '', refresh_token: '' }

    const quyx = new Quyx(sk)
    const quyxUI = new QuyxForUI(pk, tokens)

    console.log(quyx)
    console.log(quyxUI)
})()
