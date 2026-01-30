const url = 'utils/diario.pdf'

const canvas = document.querySelector('#diario-render')
const context = canvas.getContext('2d')

pdfjsLib.getDocument(url).promise.then(pdfDoc => {

    pdfDoc.getPage(1).then(page => {

        const viewport = page.getViewport({scale: 1.5})
        canvas.height = viewport.height
        canvas.width = viewport.width

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        }

        page.render(renderContext)

    })

}).catch(err => {

    document.body.innerHTML = "<h1>Erro ao Carregar o Arquivo utils/diario.pdf</h1>"

})