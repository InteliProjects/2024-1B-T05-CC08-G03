let ultimaEntrada = 0; // Armazena a última entrada válida capturada

document.addEventListener('DOMContentLoaded', function() {
    const keyMap = {
        'ArrowUp': 1,
        'ArrowDown': 2,
        'ArrowLeft': 3,
        'ArrowRight': 4,
        ' ': 5,  // Espaço
        'Enter': 6,
        'mousedown': {
            // 0: 7,  
            // 2: 8  
        },
        'mousemove': {
            // 'up': 9,
            // 'down': 10,
            // 'left': 11,
            // 'right': 12
        }
    };

    function updateDisplay(value) {
        ultimaEntrada = value; 
        document.getElementById('ResultadoKey').innerText = 'Valor retornado: ' + value;
    }

    window.addEventListener('keydown', function(event) {
        if (keyMap[event.key] !== undefined) {
            updateDisplay(keyMap[event.key]);
        }
    });

    // window.addEventListener('mousedown', function(event) {
    //     if (keyMap['mousedown'] && keyMap['mousedown'][event.button] !== undefined) {
    //         updateDisplay(keyMap['mousedown'][event.button]);
    //     }
    // });

    // window.addEventListener('mousemove', function(event) {
    //     if (Math.abs(event.movementX) > Math.abs(event.movementY)) {
    //         updateDisplay(event.movementX > 0 ? keyMap['mousemove']['right'] : keyMap['mousemove']['left']);
    //     } else {
    //         updateDisplay(event.movementY > 0 ? keyMap['mousemove']['down'] : keyMap['mousemove']['up']);
    //     }
    // });

    window.consultar = function() {
        const valorAtual = ultimaEntrada;
        ultimaEntrada = 0;
        return valorAtual;
    };

    document.getElementById('consultaBtn').addEventListener('click', function() {
        document.getElementById('ResultadoConsulta').innerText = 'Última entrada: ' + consultar();
    });
});
