'use strict'
var gImgs
var gMeme
var gNextId = 0
var gImgCount = 18
var gKeywordSearchCountMap
//*init the model called in the main controller
function initModel() {
    gImgs = []
    gKeywordSearchCountMap = {}
    _createImgs()
    _createKeywordsMap()
    initMeme()
}

function initMeme() {
    gMeme = {
        selectedImgId: 1,
        selectedLineIdx: null,
        width: 0,
        lines: [_createLine('Enter Line Here')],
    }
}
//get
function getMeme() {
    return gMeme
}
//get
function getImgById(id) {
    const img = gImgs.filter((imgObj) => imgObj.id === id)[0]
    return img
}
//get list
function getImgs() {
    return gImgs
}
//set img
function imgSelect(id) {
    gMeme.selectedImgId = id
}
//*edit meme functions
//*change txt
function setLineTxt(txt) {
    //todo Later add idx so it will know what line to change
    gMeme.lines[gMeme.selectedLineIdx].txt = txt

    if (gMeme.lines[gMeme.selectedLineIdx].isNew) {
        gMeme.lines[gMeme.selectedLineIdx].isNew = false
    }
}

//*change storke
function changeStroke(strokeClr) {
    if (gMeme.selectedLineIdx === null) return
    const line = gMeme.lines[gMeme.selectedLineIdx]
    line.strokeClr = strokeClr
}
//*change fill
function changeFill(fillClr) {
    if (gMeme.selectedLineIdx === null) return
    const line = gMeme.lines[gMeme.selectedLineIdx]
    line.fillClr = fillClr
}
//*change fontSize
function changeFontSize(diff) {
    const line = gMeme.lines[gMeme.selectedLineIdx]
    line.size = line.size + diff
}
//*change fontFamily
function changeFontFamily(newFont) {
    const line = gMeme.lines[gMeme.selectedLineIdx]
    line.fontFamily = newFont
}
//*add line
function addLine() {
    gMeme.lines.push(_createLine())
}
//*focus on a different line
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

//*change alignment
function changeAlign(align) {
    const lines = gMeme.lines
    lines[gMeme.selectedLineIdx].align = align
}
//*delete line
function deleteLine() {
    if (gMeme.selectedLineIdx === null) return

    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    gMeme.selectedLineIdx = null
}
//*helpers for positioning

//*updates the line width when txt change - width in pixels
function updateLineWidth() {
    line = gMeme.lines[gMeme.selectedLineIdx]

    gCtx.font = `${line.size}px ${line.fontFamily}`
    var textMetrics = gCtx.measureText(line.txt)
    line.width = textMetrics.width
}

//*check if an event position is on a line of txt
function isOnLine(pos) {
    const { lines } = gMeme

    const idx = lines.findIndex((line) => {
        const linePos = posToPixels(line.pos)
        const isInWidth = pos.x >= linePos.x && pos.x <= linePos.x + line.width
        const isInHeight = pos.y >= linePos.y && pos.y <= linePos.y + fontSizeToAbs(line.size)
        return isInHeight && isInWidth
    })
    return idx
}

//*take a relative pos and change it for pixel pos . required for drawing the lines
function posToPixels(pos) {
    let x = pos.x
    let y = pos.y

    x = (x * gMeme.width) / 100
    y = (y * gMeme.width) / 100
    //*todo probably will have to change when add support for different size of meme
    return { x, y }
}
//*take an absolute pos and change it to relative import for moving the lines of txt and saving new position
function posToRelative(pos) {
    let x = pos.x
    let y = pos.y

    x = (x / gMeme.width) * 100
    y = (y / gMeme.width) * 100
    return { x, y }
}
//*take any size and convert it to precents in relation to the width of the canvas
function WidthToPrecent(x) {
    return (x / gMeme.width) * 100
}
function fontSizeToAbs(size) {
    return (size / 100) * gMeme.width
}
function HeightToPrecent(y) {
    //todo implement it
}
//*when resizing the meme update the width in pixels importent for getting the width of a txt in precents
function setMemeWidth(width) {
    gMeme.width = width
}
//*set the position of every line relative to current size of canvas
function setLinePos(line, idx) {
    const { width, align } = line
    let { pos } = line
    const txtWidth = WidthToPrecent(width)

    if (pos) {
        if (align === 'left') {
            pos.x = 10
        } else if (align === 'right') {
            pos.x = 90 - txtWidth
        } else if (align === 'center') {
            pos.x = 50 - txtWidth / 2
        }
    } else {
        line.pos = {}
        pos = line.pos

        if (idx === 0) {
            pos.x = 50 - txtWidth / 2
            pos.y = 5
        } else if (idx === 1) {
            pos.x = 50 - txtWidth / 2
            pos.y = 90
        } else {
            pos.x = 5 + (idx - 3)
            pos.y = 50 + (idx - 3)
        }
    }

    return pos
}
//*when setting the line in the controller recieve the width with the settings of the lines and put in the model
function setLineWidth(line, width) {
    line.width = width
}

function saveMeme(memeName) {
    const savedMemes = getSavedMemes()
    const meme = getMeme()
    savedMemes.push({ id: makeid(), name: memeName, meme: meme, memeDataURL: gElCanvas.toDataURL() })
    saveMemesToStorage()
    // saveMemesToStorage()
}

//private functions

function _createImg(keywords = ['funny', 'cat']) {
    return {
        id: gNextId++,
        url: `imgs/${gNextId}.jpg`,
        keywords,
    }
}

function _createImgs() {
    //1
    gImgs.push(_createImg(['trump', 'politcal']))
    //2
    gImgs.push(_createImg(['dog', 'cute']))
    //3
    gImgs.push(_createImg(['cute', 'dogl', 'baby', 'sleep']))
    //4
    gImgs.push(_createImg(['cat', 'sleep']))
    //5
    gImgs.push(_createImg(['kid', 'winner']))
    //6
    gImgs.push(_createImg(['man', 'explain']))
    //7
    gImgs.push(_createImg(['baby', 'suprise']))
    //8
    gImgs.push(_createImg(['the doctor', 'happy']))
    //9
    gImgs.push(_createImg(['baby', 'happy']))
    //10
    gImgs.push(_createImg(['obama', 'politcal', 'happy']))
    //11
    gImgs.push(_createImg(['kissing']))
    //12
    gImgs.push(_createImg(['justice', 'reality-tv']))
    //13
    gImgs.push(_createImg(['leonardo', 'movie']))
    //14
    gImgs.push(_createImg(['matrix', 'movie']))
    //15
    gImgs.push(_createImg(['walking deads', 'zombies']))
    //16
    gImgs.push(_createImg(['movie', 'stark-trek']))
    //17
    gImgs.push(_createImg(['putin', 'politcal']))
    //18
    gImgs.push(_createImg(['toystory', 'movie']))
}

function _createLine(txt = 'enter line', strokeClr = '#000000', fillClr = '#ffffff', size = 10, fontFamily = 'Impact', align = 'center') {
    return { txt, strokeClr, fillClr, size, fontFamily, pos: null, width: null, isNew: true, align, isDragged: false }
}
function _createKeywordsMap() {
    gKeywordSearchCountMap = gImgs.reduce((accu, img) => {
        const imgKeyWords = img.keywords.reduce((acc, keyword) => {
            acc[keyword] = 1
            return acc
        }, {})
        for (let keyword in imgKeyWords) {
            if (accu[keyword]) accu[keyword] += 1
            else accu[keyword] = 1
        }
        return accu
    }, {})
}
