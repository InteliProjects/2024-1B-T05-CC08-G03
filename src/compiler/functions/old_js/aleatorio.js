function aleatorio(min, max) {
    var min = parseInt(document.getElementById('minNumber').value);
    var max = parseInt(document.getElementById('maxNumber').value);
    if (min > max) {
        let temp = min;
        min = max;
        max = temp;
    }
    var resultado = Math.floor(Math.random() * (max - min + 1) + min);
    document.getElementById('resultadoAleatorio').innerText = "Número Aleatório: " + resultado;
    return resultado
}

console.log(aleatorio(1, 10));
console.log(aleatorio(5, 5)); 
