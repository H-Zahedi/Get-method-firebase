const loadExternalFile = cdn => {
    return new Promise((resolve,reject) =>{
        const linkTag = document.createElement('link')

        linkTag.rel = 'stylesheet'
        linkTag.href = cdn

        linkTag.onload = () => resolve('File Loaded Successfully')
        linkTag.onerror = () => reject(new Error('File Not Loaded'))

        document.head.append(linkTag)

    })
}

loadExternalFile('/promise.css')
    .then(response => {
        console.log(response);

        document.body.insertAdjacentHTML('afterbegin', `<h1 class="message">Css External ${response}`)

    })
    .catch(err => {
        console.log(err)
    })