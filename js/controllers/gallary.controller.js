'use strict'

function renderGallary() {
    const imgs = getImgs()

    const elMainGallary = document.querySelector('.main-gallary')

    let strHtml = imgs.map(({ url, id }) => `<img src = '${url}'/ onclick  = 'onImgSelect(this)' data-id = '${id}'>`)
    elMainGallary.innerHTML = strHtml.join('')
}

function onImgSelect({ dataset }) {
    const elMemeEditoer = document.querySelector('.meme-editor ')
    const elGallary = document.querySelector('.gallary')
    const elSelected = document.querySelector('.selected')

    elMemeEditoer.classList.remove('hidden')
    elGallary.classList.add('hidden')
    elSelected.classList.remove('selected')

    imgSelect(+dataset.id)
    renderMeme()
}

function onGallary(elGallaryLink) {
    elGallaryLink.classList.add('selected')
    const elMemeEditoer = document.querySelector('.meme-editor ')
    const elGallary = document.querySelector('.gallary')

    elMemeEditoer.classList.add('hidden')
    elGallary.classList.remove('hidden')
}
