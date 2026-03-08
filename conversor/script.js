function converter() {

    let numero = document.getElementById("numero").value.trim();
    let origem = parseInt(document.getElementById("origem").value);
    let destino = parseInt(document.getElementById("destino").value);
    let saida = document.getElementById("resultado");

    if (origem === destino) {
        saida.innerText = "Base de origem e destino são iguais.";
        return;
    }

    let explicacao = "";
    let decimal;

    // Converter para decimal primeiro
    if (origem === 10) {
        decimal = parseInt(numero);
    } else {
        decimal = parseInt(numero, origem);
    }

    // ==========================
    // DECIMAL → BINÁRIO
    // ==========================
    if (origem === 10 && destino === 2) {

        explicacao += "Conversão Decimal → Binário\n";
        explicacao += "Método: Divisões sucessivas por 2\n\n";

        let temp = decimal;
        let restos = [];

        while (temp > 0) {
            let quociente = Math.floor(temp / 2);
            let resto = temp % 2;
            explicacao += temp + " ÷ 2 = " + quociente + " resto " + resto + "\n";
            restos.push(resto);
            temp = quociente;
        }

        explicacao += "\nLendo restos de baixo para cima:\n";
        let bin = restos.reverse().join("");
        explicacao += "Resultado Final: " + bin;
    }

    // ==========================
    // DECIMAL → HEXADECIMAL
    // ==========================
    else if (origem === 10 && destino === 16) {

        explicacao += "Conversão Decimal → Hexadecimal\n";
        explicacao += "Método: Divisões sucessivas por 16\n\n";

        let temp = decimal;
        let restos = [];

        while (temp > 0) {
            let quociente = Math.floor(temp / 16);
            let resto = temp % 16;
            explicacao += temp + " ÷ 16 = " + quociente + " resto " + resto + "\n";
            restos.push(resto);
            temp = quociente;
        }

        explicacao += "\nConvertendo restos maiores que 9:\n";

        let hex = restos.reverse().map(r => {
            if (r >= 10) {
                let letra = String.fromCharCode(55 + r);
                explicacao += r + " = " + letra + "\n";
                return letra;
            }
            return r;
        }).join("");

        explicacao += "\nResultado Final: " + hex;
    }

    // ==========================
    // BINÁRIO → DECIMAL
    // ==========================
    else if (origem === 2 && destino === 10) {

        explicacao += "Conversão Binário → Decimal\n";
        explicacao += "Método: Multiplicação por potências de 2\n\n";

        let potencia = numero.length - 1;
        let soma = 0;

        for (let i = 0; i < numero.length; i++) {
            let bit = parseInt(numero[i]);
            let valor = bit * Math.pow(2, potencia - i);
            explicacao += bit + " × 2^" + (potencia - i) + " = " + valor + "\n";
            soma += valor;
        }

        explicacao += "\nSomando todos os valores:\n";
        explicacao += "Resultado Final: " + soma;
    }

    // ==========================
    // HEXA → DECIMAL
    // ==========================
    else if (origem === 16 && destino === 10) {

        explicacao += "Conversão Hexadecimal → Decimal\n";
        explicacao += "Método: Multiplicação por potências de 16\n\n";

        let potencia = numero.length - 1;
        let soma = 0;

        for (let i = 0; i < numero.length; i++) {
            let valorHex = parseInt(numero[i], 16);
            let valor = valorHex * Math.pow(16, potencia - i);
            explicacao += valorHex + " × 16^" + (potencia - i) + " = " + valor + "\n";
            soma += valor;
        }

        explicacao += "\nSomando todos os valores:\n";
        explicacao += "Resultado Final: " + soma;
    }

    // ==========================
    // Conversões Indiretas
    // ==========================
    else {

        explicacao += "Conversão em duas etapas:\n";
        explicacao += "1) Converter para Decimal\n";
        explicacao += "Valor Decimal: " + decimal + "\n\n";

        if (destino === 2) {
            explicacao += "2) Converter Decimal → Binário\n";
            explicacao += decimal.toString(2);
        }

        if (destino === 16) {
            explicacao += "2) Converter Decimal → Hexadecimal\n";
            explicacao += decimal.toString(16).toUpperCase();
        }
    }

    saida.innerText = explicacao;
}

// ==========================
// TABELA
// ==========================
function gerarTabela() {

    let html = "<table>";
    html += "<tr><th>Decimal</th><th>Binário</th><th>Hexadecimal</th></tr>";

    for (let i = 0; i <= 32; i++) {
        html += "<tr>";
        html += "<td>" + i + "</td>";
        html += "<td>" + i.toString(2) + "</td>";
        html += "<td>" + i.toString(16).toUpperCase() + "</td>";
        html += "</tr>";
    }

    html += "</table>";

    document.getElementById("tabela").innerHTML = html;
}
