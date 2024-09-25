'use strict'

function renderGallary() {
    const imgs = getImgs()

    const elMainGallary = document.querySelector('.main-gallary')

    let strHtml = imgs.map(({ url, id }) => `<img src = '${url}'/ onclick  = 'onImgSelect(this)' data-id = '${id}'>`)
    elMainGallary.innerHTML = strHtml.join('')
}

function onImgSelect({ dataset }) {
    console.log(dataset.id)
    imgSelect(+dataset.id)
    renderMeme()
}
