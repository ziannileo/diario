const url = 'utils/diario.pdf'
const pdfjsLib = window['pdfjs-dist/build/pdf']
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'

async function startDiario() {
    try {
        const pdf = await pdfjsLib.getDocument(url).promise     
        const container = document.getElementById('diario-container')

        const primeiraPagina = await pdf.getPage(1);
        const tempViewport = primeiraPagina.getViewport({ scale: 1 });
        const realRatio = (tempViewport.width / 2) / tempViewport.height;

        const paddingCapas = 100;
        let calcH = window.innerHeight * 0.95; 
        let calcW = calcH * realRatio;

        if ((calcW * 2) > window.innerWidth) {
            calcW = (window.innerWidth * 0.98) / 2;
            calcH = calcW / realRatio;
        }

        for (let i = 1; i <= pdf.numPages; i++) {
            const pagina = await pdf.getPage(i)
            const viewport = pagina.getViewport({ scale: 3.0 }); 

            await renderHalfPage(pagina, viewport, 'left', container)
            await renderHalfPage(pagina, viewport, 'right', container)
        }

        const paginaFlip = new St.PageFlip(container, {
            width: calcW, 
            height: calcH, 
            size: "fixed",
            mode: "double",
            drawShadow: true,
            showCover: false,
            usePortrait: false,
            mobileScrollSupport: true,
            maxShadowOpacity: 0.5
        })

        paginaFlip.loadFromHTML(document.querySelectorAll('.page'))

        setTimeout(() => {
            const loader = document.getElementById('loader');
            loader.classList.add('loader-hidden');
            container.classList.add('st--ready');
        }, 500)

        container.classList.add('st--ready')

        container.addEventListener('wheel', (e) => {
            if (e.deltaY > 0) paginaFlip.flipNext()
            else paginaFlip.flipPrev()
            e.preventDefault()
        }, { passive: false })

    } catch (err) {
        console.error("Erro:", err)
    }
}

async function renderHalfPage(pagina, viewport, side, container) {
    const paginaDiv = document.createElement('div')
    paginaDiv.className = 'page'
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = viewport.width / 2
    canvas.height = viewport.height
    paginaDiv.appendChild(canvas)
    container.appendChild(paginaDiv)
    const transform = side === 'right' ? [1, 0, 0, 1, -(viewport.width / 2), 0] : [1, 0, 0, 1, 0, 0]
    return pagina.render({canvasContext: context, viewport: viewport, transform: transform}).promise
}

startDiario()