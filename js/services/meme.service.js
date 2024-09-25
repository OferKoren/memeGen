var gImgs = [{ id: 1, url: 'imgs/1.jpg', keywords: ['funny', 'cat'] }]
var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'I sometimes eat Falafel',
            size: 20,
            color: 'red',
            fontFamily: 'Ariel',
        },
    ],
}
var gKeywordSearchCountMap = { funny: 12, cat: 16, baby: 2 }

function getMeme() {
    return gMeme
}

function getImgById(id) {
    const img = gImgs.filter((imgObj) => imgObj.id === id)[0]
    return img
}

function setLineTxt(txt) {
    //todo Later add idx so it will know what line to change
    gMeme.lines[0].txt = txt
}
