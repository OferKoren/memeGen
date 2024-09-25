'use strict'
let gElCanvas
let gCtx
let gElImg
function renderMeme() {
    // clearCanvas()
    console.log('render meme')
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
    gElImg = new Image()
    gElImg.src = url

    //waiting for img to load and then show it
    gElImg.onload = () => {
        gCtx.drawImage(gElImg, 0, 0, gElCanvas.width, gElCanvas.height)
        //*drawing the lines after the img finish to load so it wont be behind the txt
        drawLines()
    }
}

function drawLines() {
    const { lines, selectedLineIdx } = getMeme()

    lines.forEach((line, idx) => {
        const { color, txt, size, fontFamily } = line
        gCtx.font = `${size}px ${fontFamily}`
        gCtx.strokeStyle = color
        gCtx.fillStyle = `white`
        gCtx.textBaseline = 'middle'
        gCtx.lineWidth = 2

        line.width = gCtx.measureText(txt).width

        //todo to add if to act differenty for first and second lines
        let pos = line.pos
        console.log()
        if (!pos) {
            line.pos = {}
            pos = line.pos

            if (idx === 0) {
                pos.x = 10
                pos.y = 15
            } else if (idx === 1) {
                pos.x = 10
                pos.y = gElCanvas.height - 15
            } else {
                pos.x = 10 + (idx - 3) * 6
                pos.y = gElCanvas.height / 2 + (idx - 3) * 6
            }
        }

        gCtx.strokeText(txt, pos.x, pos.y)
        gCtx.fillText(txt, pos.x, pos.y)
    })

    if (typeof selectedLineIdx === 'number') {
        renderLineFrame()
    }
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
function renderLineProperties() {
    const { lines, selectedLineIdx } = getMeme()
    const selectedLine = lines[selectedLineIdx]
    const { size, color, fontFamily, txt } = selectedLine

    const eltxt = document.querySelector('.editor-txt')
    const strokeClr = document.querySelector('.stroke-clr')

    const isNew = selectedLine.isNew
    if (isNew) {
        eltxt.value = ''
        eltxt.placeholder = txt
    } else {
        eltxt.value = txt
    }

    strokeClr.value = color
}
function onAddLine() {
    addLine()
    renderMeme()

    onSwitchLine('new')
}
function onSwitchLine(isNew) {
    renderMeme()
    switchLine(isNew)
    renderLineProperties()
}
function renderLineFrame() {
    const { selectedLineIdx, lines } = getMeme()
    const line = lines[selectedLineIdx]
    const pos = line.pos

    const framePos = { x: pos.x - 5, y: pos.y - (5 + line.size / 2) }

    gCtx.beginPath()
    gCtx.strokeStyle = 'black'
    gCtx.lineWidth = 2
    gCtx.rect(framePos.x, framePos.y, line.width + 10, line.size + 10)
    gCtx.stroke()
}
