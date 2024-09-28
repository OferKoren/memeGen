'use strict'
let gElCanvas
let gCtx
let gPreviousPos
const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

//*init the canvas called in the controller
function initCanvas() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')

    addListeners()
}

//*render the meme
function renderMeme(Savedmeme) {
    // clearCanvas()
    // console.log('render meme')
    const meme = Savedmeme || getMeme()
    const img = getImgById(meme.selectedImgId)
    drawMeme(img.url, meme)
}

//*resize the canvas
function resizeCanvas() {
    const elCanvasWrapper = document.querySelector('.canvas-wrapper')
    // console.log(elCanvasWrapper)
    gElCanvas.width = elCanvasWrapper.clientWidth - 10
    gElCanvas.height = elCanvasWrapper.clientWidth - 10

    setMemeWidth(gElCanvas.width)
}

//* draw on the canvas the img of the the meme called in renderMeme
function drawMeme(url, meme) {
    const ElImg = new Image()
    ElImg.src = url

    //waiting for img to load and then show it
    ElImg.onload = () => {
        resizeCanvas()
        gCtx.drawImage(ElImg, 0, 0, gElCanvas.width, gElCanvas.height)
        //*drawing the lines after the img finish to load so it wont be behind the txt
        drawLines(meme)
    }
}

//*draw the lines of the meme on th canvas called in draw meme so it will happen after img finish loading
function drawLines(meme) {
    const { lines, selectedLineIdx, width } = meme || getMeme()

    lines.forEach((line, idx) => {
        const { fillClr, strokeClr, txt, size, fontFamily } = line
        const absSize = fontSizeToAbs(size)
        gCtx.font = `${absSize}px ${fontFamily}`
        gCtx.strokeStyle = strokeClr
        gCtx.fillStyle = fillClr
        gCtx.textBaseline = 'top'
        gCtx.lineWidth = 5

        const width = gCtx.measureText(txt).width
        setLineWidth(line, width)
        const pos = setLinePos(line, idx)
        const pixelPos = posToPixels(pos)
        gCtx.strokeText(txt, pixelPos.x, pixelPos.y)
        gCtx.fillText(txt, pixelPos.x, pixelPos.y)
    })

    if (typeof selectedLineIdx === 'number') {
        renderLineFrame()
    }
    // Set the stroke width
}

//* interaction with Meme edtior

//*change the line txt
function onSetLineTxt({ value }) {
    // console.log(value)
    setLineTxt(value)
    renderMeme()
}

//*change txt align
function onChangeAlign(align) {
    changeAlign(align)
    renderMeme()
}

//*change stroke color when stroke input changes
function onChangeStrokeColor({ value }) {
    //*value in this situation is the stroke clr from the input
    changeStroke(value)
    renderMeme()
}

//*open the stroke input when button clicked - required because we want a button to open an input
function onOpenStorkeInput() {
    const elStorke = document.querySelector('.stroke-clr')
    elStorke.click()
}

//*change font size
function onChangeFontSize({ dataset }) {
    const diff = +dataset.diff
    changeFontSize(diff)
    renderMeme()
}

//*change font family
function onChangeFontFamily({ value }) {
    changeFontFamily(value)
    renderMeme()
}

//*add another line
function onAddLine() {
    addLine()
    renderMeme()

    onSwitchLine('new')

    //focus on the txt input
    const elTxtInput = document.querySelector('.editor-txt')
    elTxtInput.focus()
}

//*focus on a different line
function onSwitchLine(isNew = 'not new', idx) {
    renderMeme()
    switchLine(isNew, idx)
    renderLineProperties()
}

//*render all the current setting of a specific line
function renderLineProperties() {
    const eltxt = document.querySelector('.editor-txt')
    const elChaneFont = document.querySelector('.change-font')
    const { lines, selectedLineIdx } = getMeme()

    if (selectedLineIdx === null) {
        eltxt.value = ''
        eltxt.placeholder = 'pick a line to edit'
        elChaneFont.value = 'Impact'
        return
    }

    const selectedLine = lines[selectedLineIdx]
    const { size, strokeClr, fontFamily, txt } = selectedLine

    const isNew = selectedLine.isNew
    if (isNew) {
        eltxt.value = ''
        eltxt.placeholder = txt
    } else {
        eltxt.value = txt
    }
}

//*render select line frame
function renderLineFrame() {
    const { selectedLineIdx, lines } = getMeme()
    const line = lines[selectedLineIdx]
    const pos = posToPixels(line.pos)

    const framePos = { x: pos.x - 5, y: pos.y - 5 }

    gCtx.beginPath()
    gCtx.strokeStyle = 'black'
    gCtx.lineWidth = 2
    gCtx.rect(framePos.x, framePos.y, line.width + 10, fontSizeToAbs(line.size) + 10)
    gCtx.stroke()
}

//* delete line
function onDeleteLine() {
    deleteLine()
    renderLineProperties()
    renderMeme()
}

//* save meme
function onSaveMeme() {
    //todo open dialog to enter meme name
    const meme = getMeme()
    meme.selectedLineIdx = null
    renderMeme()

    setTimeout(() => {
        if (meme.id) {
            updateSavedMeme(meme.id)

            return
        }
        const memeName = prompt('enter meme name')
        saveMeme(memeName)
    }, 10)
}

//*eventListeners and helpers for event handling
function addListeners() {
    addMouseListeners()
    addTouchListeners()

    window.addEventListener('resize', () => {
        setTimeout(() => {
            resizeCanvas()
            renderMeme()
        }, 10)
    })
}

function onDown(ev) {
    const downPos = getEvPos(ev)
    const lineIdx = isOnLine(downPos)
    if (lineIdx === -1) {
        const meme = getMeme()
        meme.selectedLineIdx = null
        renderLineProperties()
        renderMeme()
        return
    }

    document.body.style.cursor = 'grabbing'
    const { lines } = getMeme()

    lines[lineIdx].isDragged = true

    gPreviousPos = posToRelative(downPos)

    onSwitchLine('not new', lineIdx)
}

function onMove(ev) {
    const { lines, selectedLineIdx } = getMeme()

    const pos = getEvPos(ev)
    const lineIdx = isOnLine(pos)
    if (lineIdx === -1) document.body.style.cursor = 'auto'
    else document.body.style.cursor = 'grab'

    if (selectedLineIdx !== null && lines[selectedLineIdx].isDragged) {
        lines[selectedLineIdx].align = 'free'
        const currPos = posToRelative(pos)

        const xDiff = currPos.x - gPreviousPos.x
        const yDiff = currPos.y - gPreviousPos.y

        const linePos = lines[selectedLineIdx].pos
        // console.log(linePos)
        linePos.x += xDiff
        linePos.y += yDiff
        gPreviousPos = currPos

        renderMeme()
    }
}

function onUp(ev) {
    const { lines, selectedLineIdx } = getMeme()
    if (selectedLineIdx !== null) lines[selectedLineIdx].isDragged = false

    const lineIdx = isOnLine(getEvPos(ev))
    if (lineIdx !== -1) {
        const elTxtInput = document.querySelector('.editor-txt')
        elTxtInput.focus()
    }
}

function onClick() {}
function addMouseListeners() {
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchend', onUp)
}

//* get event position
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

//*helpers on the canvas
function clearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}
