function lerNumero() {
    while (true) {
        let inputUsuario = prompt("Por favor, insira um número inteiro: ");
        let numeroUsuario = Number(inputUsuario);
        if (Number.isInteger(numeroUsuario)) {
            return `Muito bem, você inseriu o número: ${numeroUsuario}`;
        } else {
            console.log("Por favor, insira um número inteiro válido.");
        }
    }
}
