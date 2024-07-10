document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('myCanvasArquivo');
    const ctx = canvas.getContext('2d');
    let figuras = []; 

    window.criarImagem = function(src, x, y) {
        const img = new Image();
        img.src = src;

        const figura = { type: 'image', image: img, x: x, y: y };
        figuras.push(figura);
        const index = figuras.length - 1;

        img.onload = function() {
            const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;

            ctx.drawImage(img, 0, 0, img.width, img.height, x, y, scaledWidth, scaledHeight);
            console.log('Imagem carregada e desenhada no canvas em [' + x + ', ' + y + ']. Índice: ' + index);
        };

        img.onerror = function() {
            console.error("Não foi possível carregar a imagem em: " + img.src);
        };

        return index;
    };
});
