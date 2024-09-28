'use strict'
var gFilter
function initGallary() {
    renderGallary()
    renderDataList()
}
function renderGallary() {
    const imgs = getImgs()
    let filterdImgs = imgs
    if (gFilter) {
        filterdImgs = imgs.filter((img) => {
            if (img.keywords.filter((keyword) => keyword.includes(gFilter)).length === 0) return false
            return true
        })
    }
    const elMainGallary = document.querySelector('.main-gallary')

    let strHtml = filterdImgs.map(({ url, id }) => `<img src = '${url}'/ onclick  = 'onImgSelect(this)' data-id = '${id}'>`)
    elMainGallary.innerHTML = strHtml.join('')
}

function onImgSelect({ dataset }, isEdited = false) {
    initMeme()
    resizeCanvas()
    const elMemeEditoer = document.querySelector('.meme-editor ')
    const elGallary = document.querySelector('.gallary')
    const elSaved = document.querySelector('.saved')
    const elSelected = document.querySelector('.selected')

    elMemeEditoer.classList.remove('hidden')
    elGallary.classList.add('hidden')
    elSaved.classList.add('hidden')
    elSelected.classList.remove('selected')

    if (dataset !== null) {
        imgSelect(+dataset.id)
    } else if (isEdited) {
    } else {
        const randImgId = getRandomIntInclusive(1, gImgCount)
        imgSelect(randImgId)
    }
    renderMeme()
}
//*what  clicking the flexible
function onFlexiable() {
    onImgSelect({ dataset: null })
}
function onFilterMemes({ value }) {
    gFilter = value
    renderGallary()
}

function renderDataList() {
    var strHtml = ''
    for (let keyword in gKeywordSearchCountMap) {
        strHtml += `<option value = ${keyword}>`
    }
    const elKeyWordsDatalist = document.querySelector('.keywords-datalist')
    elKeyWordsDatalist.innerHTML = strHtml
}
function onClearSearch() {
    const elSearchInput = document.querySelector('.search-meme')
    elSearchInput.value = ''
    onFilterMemes(elSearchInput)
}
function onGallary(elGallaryLink) {
    const elSelected = document.querySelector('.selected')
    if (elSelected) elSelected.classList.remove('selected')

    elGallaryLink.classList.add('selected')
    const elMemeEditoer = document.querySelector('.meme-editor ')
    const elGallary = document.querySelector('.gallary')
    const elSaved = document.querySelector('.saved')

    elMemeEditoer.classList.add('hidden')
    elSaved.classList.add('hidden')
    elGallary.classList.remove('hidden')
}
