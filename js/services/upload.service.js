function uploadImg(elForm, ev) {
    ev.preventDefault()

    document.getElementById('imgData').value = gElCanvas.toDataURL('image/jpeg')

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        console.log('uploadedImgUrl', uploadedImgUrl)

        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        document.querySelector('.share-container').innerHTML = `
        <a class="w-inline-block social-share-btn fb share-facebook" href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
             
        </a>`
        const elShareFacebook = document.querySelector('.share-facebook')

        console.log(elShareFacebook + 'hii this is the elsharefaceboook')
        elShareFacebook.click()
    }

    doUploadImg(elForm, onSuccess)
}

function doUploadImg(elForm, onSuccess) {
    console.log('elForm', elForm)
    var formData = new FormData(elForm)
    console.log('formData', formData)
    fetch('http://ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData,
    })
        .then(function (response) {
            console.log('response', response)
            return response.text()
        })
        .then((res) => {
            console.log('res', res)
            onSuccess(res)
        })
        .catch(function (error) {
            // console.error(error)
        })
}

;(function (d, s, id) {
    var js,
        fjs = d.getElementsByTagName(s)[0]
    if (d.getElementById(id)) return
    js = d.createElement(s)
    js.id = id
    js.src = 'https://connect.facebook.net/he_IL/sdk.js#xfbml=1&version=v3.0&appId=807866106076694&autoLogAppEvents=1'
    fjs.parentNode.insertBefore(js, fjs)
})(document, 'script', 'facebook-jssdk')

function downloadMeme(elLink) {
    console.log(elLink)
    var imgContent = gElCanvas.toDataURL()
    elLink.href = imgContent
}
