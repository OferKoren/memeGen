'use strict'
let gElCanvas
let gCtx

function renderMeme() {
    const meme = getMeme()
    const img = getImgById(meme.selectedImgId)
    drawImg(img.url)
}

function initCanvas() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
}

function drawImg(url) {
    const elImg = new Image()
    elImg.src = url
    console.log(elImg)

    //waiting for img to load and then show it
    elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
    }
}
