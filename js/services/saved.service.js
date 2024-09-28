'use strict'
var gSavedMemes = []
const MEMES_KEY = 'saved memes'

function initSavedMemes() {
    console.log('hi')
    const MemesFromStorage = loadFromStorage(MEMES_KEY)
    if (MemesFromStorage && MemesFromStorage.length !== 0) {
        console.log('loading-memes from storage')
        gSavedMemes = MemesFromStorage
    }
}

function getSavedMemes() {
    return gSavedMemes
}

function getMemeById(id) {
    return gSavedMemes.filter((meme) => meme.id === id)[0]
}

function deleteMeme(id) {
    const deleteIdx = gSavedMemes.findIndex((meme) => meme.id === id)
    gSavedMemes.splice(deleteIdx, 1)
    saveMemesToStorage()
}

function getMemeCopyById(id) {}

function updateSavedMeme(id) {
    const editedMemeIdx = gSavedMemes.findIndex((meme) => meme.id === id)
    gSavedMemes[editedMemeIdx].meme = gMeme
    gSavedMemes[editedMemeIdx].memeDataURL = gElCanvas.toDataURL()

    saveMemesToStorage()
}
function saveMemesToStorage() {
    saveToStorage(MEMES_KEY, gSavedMemes)
}
