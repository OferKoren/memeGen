'use strict'
let gElCanvas
let gCtx

function renderMeme() {
    // clearCanvas()
    const meme = getMeme()
    const img = getImgById(meme.selectedImgId)
    drawMeme(img.url)
}

function initCanvas() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
}

//draw on the canvas the img of the meme
function drawMeme(url) {
    const elImg = new Image()
    elImg.src = url

    //waiting for img to load and then show it
    elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
        //*drawing the lines after the img finish to load so it wont be behind the txt
        drawLines()
    }
}

function drawLines() {
    const { lines } = getMeme()

    lines.forEach((line, idx) => {
        const { color, txt, size, fontFamily } = line
        gCtx.font = `${size}px ${fontFamily}`
        gCtx.strokeStyle = color
        gCtx.fillStyle = `white`
        // gCtx.textAlign = 'center'
        gCtx.textBaseline = 'middle'
        gCtx.lineWidth = 2

        //todo to add if to act differenty for first and second lines
        gCtx.strokeText(txt, 10, 10)
        gCtx.fillText(txt, 10, 10)
    })

    // Set the stroke width
}

function onSetLineTxt({ value }) {
    // console.log(value)
    setLineTxt(value)
    renderMeme()
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function onChangeStrokeColor({ value }) {
    //*value in this situation is the stroke clr from the input
    changeStroke(value)
    renderMeme()
}
function onChangeFont({ dataset }) {
    const diff = +dataset.diff
    changeFont(diff)
    renderMeme()
}
