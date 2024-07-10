document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');

    let figuras = []; 

    function criar_figura(tipo, cor, x, y, tamanho) {
        if (tipo !== 'circulo' && tipo !== 'quadrado' && tipo !== 'triangulo') {
            return -1;
        }

        const figura = {
            tipo: tipo,
            cor: cor,
            x: x,
            y: y,
            tamanho: tamanho
        };

        figuras.push(figura);
        desenhar_figura(figura);
        return figuras.length - 1;
    }

    function desenhar_figura(figura) {
        ctx.fillStyle = figura.cor;

        if (figura.tipo === 'circulo') {
            ctx.beginPath();
            ctx.arc(figura.x, figura.y, figura.tamanho, 0, Math.PI * 2);
            ctx.fill();
        } else if (figura.tipo === 'quadrado') {
            ctx.fillRect(figura.x - figura.tamanho / 2, figura.y - figura.tamanho / 2, figura.tamanho, figura.tamanho);
        } else if (figura.tipo === 'triangulo') {
            ctx.beginPath();
            ctx.moveTo(figura.x, figura.y - figura.tamanho);
            ctx.lineTo(figura.x - figura.tamanho, figura.y + figura.tamanho);
            ctx.lineTo(figura.x + figura.tamanho, figura.y + figura.tamanho);
            ctx.closePath();
            ctx.fill();
        }
    }

    window.criar_figura = criar_figura;

    document.getElementById('btnCirculo').addEventListener('click', function() {
        const index = criar_figura('circulo', 'red', 150, 150, 50);
        console.log(index);
    });

    document.getElementById('btnQuadrado').addEventListener('click', function() {
        const index = criar_figura('quadrado', 'blue', 300, 300, 100);
        console.log(index)
    });

    document.getElementById('btnTriangulo').addEventListener('click', function() {
        const index = criar_figura('triangulo', 'green', 150, 300, 50);
        console.log(`Índice do triângulo: ${index}`);
    });
});
