'use strict'
var gImgs
var gMeme
var gNextId = 0
var gImgCount = 18
function initModel() {
    /*  gImgs = [
        { id: 1, url: 'imgs/1.jpg', keywords: ['funny', 'cat'] },
        { id: 2, url: 'imgs/2.jpg', keywords: ['funny', 'cat'] },
        { id: 3, url: 'imgs/3.jpg', keywords: ['funny', 'cat'] },
    ] */
    gImgs = []
    _createImgs()
    gMeme = {
        selectedImgId: 1,
        selectedLineIdx: null,
        lines: [_createLine('ilikefalafcacsascasel'), _createLine('but i prefer shawarma')],
    }
}
var gKeywordSearchCountMap = { funny: 12, cat: 16, baby: 2 }

function _createImg(keywords = ['funny', 'cat']) {
    return {
        id: gNextId++,
        url: `imgs/${gNextId}.jpg`,
        keywords,
    }
}

function _createImgs() {
    for (let i = 0; i < gImgCount; i++) {
        gImgs.push(_createImg())
    }
}
function getMeme() {
    return gMeme
}

function getImgById(id) {
    const img = gImgs.filter((imgObj) => imgObj.id === id)[0]
    return img
}
//list
function getImgs() {
    return gImgs
}
function setLineTxt(txt) {
    //todo Later add idx so it will know what line to change
    gMeme.lines[gMeme.selectedLineIdx].txt = txt

    if (gMeme.lines[gMeme.selectedLineIdx].isNew) {
        gMeme.lines[gMeme.selectedLineIdx].isNew = false
    }
}
function imgSelect(id) {
    gMeme.selectedImgId = id
}
//*change storke
function changeStroke(strokeClr) {
    if (gMeme.selectedLineIdx === null) return
    const line = gMeme.lines[gMeme.selectedLineIdx]
    line.color = strokeClr
}

//*change fontSize
function changeFont(diff) {
    const line = gMeme.lines[gMeme.selectedLineIdx]
    line.size = line.size + diff
}

function addLine() {
    gMeme.lines.push(_createLine())
}

function switchLine(isNew, idx) {
    if (isNew === 'new') {
        gMeme.selectedLineIdx = gMeme.lines.length - 1
        return
    }
    //what happens when mouse clicked
    if (idx || idx === 0) {
        gMeme.selectedLineIdx = idx
        return
    }
    if (gMeme.selectedLineIdx === null) {
        gMeme.selectedLineIdx = 0
        return
    }
    const lineIdx = ++gMeme.selectedLineIdx
    if (lineIdx === gMeme.lines.length) gMeme.selectedLineIdx = 0
}

function updateLineWidth() {
    line = gMeme.lines[gMeme.selectedLineIdx]

    gCtx.font = `${line.size}px ${line.fontFamily}`
    var textMetrics = gCtx.measureText(line.txt)
    line.width = textMetrics.width
}

function isOnLine(pos) {
    const { lines } = gMeme
    const idx = lines.findIndex((line) => {
        const isInWidth = pos.x >= line.pos.x && pos.x <= line.pos.x + line.width
        const isInHeight = pos.y >= line.pos.y && pos.y <= line.pos.y + line.size
        return isInHeight && isInWidth
    })
    return idx
}
// function setLineWidth(txt, size, fontFamily) {
//     gCtx.font = `${size}px ${fontFamily}`
//     gCtx.lineWidth = 2
//     var textMetrics = gCtx.measureText(txt)
//     return textMetrics.width
// }
//*private
function _createLine(txt = 'enter line', color = '#ff0000', size = 20, fontFamily = 'Arial') {
    return { txt, color, size, fontFamily, pos: null, width: null, isNew: true }
}
