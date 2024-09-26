'use strict'
let gElCanvas
let gCtx

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

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
    addListeners()
}

//draw on the canvas the img of the meme
function drawMeme(url) {
    const ElImg = new Image()
    ElImg.src = url

    //waiting for img to load and then show it
    ElImg.onload = () => {
        gCtx.drawImage(ElImg, 0, 0, gElCanvas.width, gElCanvas.height)
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
        gCtx.textBaseline = 'top'
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
function onSwitchLine(isNew = 'not', idx) {
    renderMeme()
    switchLine(isNew, idx)
    renderLineProperties()
}

function renderLineFrame() {
    const { selectedLineIdx, lines } = getMeme()
    const line = lines[selectedLineIdx]
    const pos = line.pos

    const framePos = { x: pos.x - 5, y: pos.y - 5 }

    gCtx.beginPath()
    gCtx.strokeStyle = 'black'
    gCtx.lineWidth = 2
    gCtx.rect(framePos.x, framePos.y, line.width + 10, line.size + 10)
    gCtx.stroke()
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
}
function onDown(ev) {
    const downPos = getEvPos(ev)
    const lineIdx = isOnLine(downPos)
    if (lineIdx === -1) return

    document.body.style.cursor = 'grabbing'
    onSwitchLine('not', lineIdx)
}
function onMove(ev) {
    const pos = getEvPos(ev)
    const lineIdx = isOnLine(pos)
    if (lineIdx === -1) document.body.style.cursor = 'auto'
    else document.body.style.cursor = 'grab'
}
function addMouseListeners() {
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
}
function addTouchListeners() {}

function getEvPos(ev) {
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }

    if (TOUCH_EVS.includes(ev.type)) {
        //* Prevent triggering the mouse screen dragging event
        ev.preventDefault()
        //* Gets the first touch point
        ev = ev.changedTouches[0]
        //* Calc the right pos according to the touch screen
        pos = {
            x: ev.clientX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.clientY - ev.target.offsetTop - ev.target.clientTop,
        }
    }
    return pos
}
