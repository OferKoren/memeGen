'use strict'

function onSaved(elSavedLink) {
    const elSelected = document.querySelector('.selected')
    if (elSelected) elSelected.classList.remove('selected')

    elSavedLink.classList.add('selected')
    const elMemeEditoer = document.querySelector('.meme-editor ')
    const elGallary = document.querySelector('.gallary')
    const elSaved = document.querySelector('.saved')

    elMemeEditoer.classList.add('hidden')
    elGallary.classList.add('hidden')
    elSaved.classList.remove('hidden')

    renderSavedMemes()
}

function renderSavedMemes() {
    const savedMeme = getSavedMemes()
    const strHTML = savedMeme.map(({ id, name, memeDataURL }) => {
        let elMeme = `<article class = 'saved-meme'>
         <img src = '${memeDataURL}'/>
         <button class = 'btn delete-meme-btn'onclick = "onDeleteMeme('${id}')">x</buttom>
         <button class = 'btn edit-meme-btn' onclick = "onEditMeme('${id}')">edit</buttom>
         </article>`
        return elMeme
    })

    const elSaved_gallary = document.querySelector('.main-saved')
    elSaved_gallary.innerHTML = strHTML.join('')
}

function onDeleteMeme(id) {
    deleteMeme(id)
    renderSavedMemes()
}

function onEditMeme(id) {
    const editedmeme = getMemeById(id).meme
    onImgSelect({ dataset: null }, true)
    gMeme = editedmeme
    gMeme.id = id
    renderMeme()
}
