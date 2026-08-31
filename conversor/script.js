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
    // DECIMAL → OCTAL
    // ==========================
    else if (origem === 10 && destino === 8) {

        explicacao += "Conversão Decimal → Octal\n";
        explicacao += "Método: Divisões sucessivas por 8\n\n";

        let temp = decimal;
        let restos = [];

        while (temp > 0) {
            let quociente = Math.floor(temp / 8);
            let resto = temp % 8;
            explicacao += temp + " ÷ 8 = " + quociente + " resto " + resto + "\n";
            restos.push(resto);
            temp = quociente;
        }

        explicacao += "\nLendo restos de baixo para cima:\n";
        let oct = restos.reverse().join("");
        explicacao += "Resultado Final: " + oct;
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
    // OCTAL → DECIMAL
    // ==========================
    else if (origem === 8 && destino === 10) {

        explicacao += "Conversão Octal → Decimal\n";
        explicacao += "Método: Multiplicação por potências de 8\n\n";

        let potencia = numero.length - 1;
        let soma = 0;

        for (let i = 0; i < numero.length; i++) {
            let digito = parseInt(numero[i], 8);
            let valor = digito * Math.pow(8, potencia - i);
            explicacao += digito + " × 8^" + (potencia - i) + " = " + valor + "\n";
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

        if (destino === 8) {
            explicacao += "2) Converter Decimal → Octal\n";
            explicacao += decimal.toString(8);
        }

        if (destino === 16) {
            explicacao += "2) Converter Decimal → Hexadecimal\n";
            explicacao += decimal.toString(16).toUpperCase();
        }
    }

    saida.innerText = explicacao;
}

// ==========================
// ARITMÉTICA BINÁRIA
// ==========================
function calcularBinario() {

    let bin1 = document.getElementById("bin1").value.trim();
    let bin2 = document.getElementById("bin2").value.trim();
    let operacao = document.getElementById("operacaoBin").value;
    let saida = document.getElementById("resultadoBin");

    let regexBinario = /^[01]+$/;
    if (!regexBinario.test(bin1) || !regexBinario.test(bin2)) {
        saida.innerText = "Digite números binários válidos (apenas 0 e 1).";
        return;
    }

    if (operacao === "soma") {
        saida.innerText = somaBinaria(bin1, bin2);
    } else if (operacao === "subtracao") {
        saida.innerText = subtracaoBinaria(bin1, bin2);
    } else if (operacao === "multiplicacao") {
        saida.innerText = multiplicacaoBinaria(bin1, bin2);
    } else if (operacao === "divisao") {
        saida.innerText = divisaoBinaria(bin1, bin2);
    }
}

function somaBinaria(a, b) {

    let maxLen = Math.max(a.length, b.length);
    a = a.padStart(maxLen, "0");
    b = b.padStart(maxLen, "0");

    let explicacao = "Soma Binária\n";
    explicacao += "Método: soma bit a bit, da direita para a esquerda, com vai-um (carry)\n\n";

    let resultado = "";
    let carry = 0;

    for (let i = maxLen - 1; i >= 0; i--) {
        let bitA = parseInt(a[i]);
        let bitB = parseInt(b[i]);
        let soma = bitA + bitB + carry;
        let bitResultado = soma % 2;
        let novoCarry = Math.floor(soma / 2);

        explicacao += bitA + " + " + bitB + " + carry(" + carry + ") = " + soma +
            " → escreve " + bitResultado + ", carry " + novoCarry + "\n";

        resultado = bitResultado + resultado;
        carry = novoCarry;
    }

    if (carry > 0) {
        resultado = carry + resultado;
        explicacao += "\nSobrou carry final: " + carry + " (acrescentado à esquerda)\n";
    }

    explicacao += "\nResultado Final: " + resultado;
    return explicacao;
}

function subtracaoBinaria(a, b) {

    let decA = parseInt(a, 2);
    let decB = parseInt(b, 2);
    let negativo = false;

    if (decB > decA) {
        negativo = true;
        let troca = a;
        a = b;
        b = troca;
    }

    let maxLen = Math.max(a.length, b.length);
    a = a.padStart(maxLen, "0");
    b = b.padStart(maxLen, "0");

    let explicacao = "Subtração Binária\n";
    explicacao += "Método: subtração bit a bit, da direita para a esquerda, com empréstimo (borrow)\n\n";

    let resultado = "";
    let borrow = 0;

    for (let i = maxLen - 1; i >= 0; i--) {
        let bitA = parseInt(a[i]);
        let bitB = parseInt(b[i]) + borrow;
        let bitResultado;

        if (bitA >= bitB) {
            bitResultado = bitA - bitB;
            explicacao += bitA + " - " + bitB + " = " + bitResultado + "\n";
            borrow = 0;
        } else {
            bitResultado = (bitA + 2) - bitB;
            explicacao += bitA + " - " + bitB + " = " + bitResultado + " (empresta 1 da próxima coluna)\n";
            borrow = 1;
        }

        resultado = bitResultado + resultado;
    }

    resultado = resultado.replace(/^0+(?=.)/, "");

    explicacao += "\nResultado Final: " + (negativo ? "-" : "") + resultado;
    return explicacao;
}

function multiplicacaoBinaria(a, b) {

    let explicacao = "Multiplicação Binária\n";
    explicacao += "Método: deslocamento e soma dos produtos parciais\n\n";
    explicacao += "  " + a + "\n× " + b + "\n\n";

    let parciais = [];

    for (let i = b.length - 1; i >= 0; i--) {
        let bit = b[i];
        let deslocamento = b.length - 1 - i;

        if (bit === "1") {
            let parcial = a + "0".repeat(deslocamento);
            parciais.push(parcial);
            explicacao += a + " × 1 (posição " + deslocamento + ") → " + parcial + "\n";
        } else {
            explicacao += a + " × 0 (posição " + deslocamento + ") → ignorado\n";
        }
    }

    let somaDecimal = parciais.reduce((acc, p) => acc + parseInt(p, 2), 0);
    let resultado = somaDecimal.toString(2);

    explicacao += "\nSomando os produtos parciais:\n";
    parciais.forEach(p => explicacao += "  " + p + "\n");

    explicacao += "\nResultado Final: " + resultado;
    return explicacao;
}

function divisaoBinaria(a, b) {

    let decA = parseInt(a, 2);
    let decB = parseInt(b, 2);

    if (decB === 0) {
        return "Erro: divisão por zero.";
    }

    let quociente = Math.floor(decA / decB);
    let resto = decA % decB;

    let explicacao = "Divisão Binária\n";
    explicacao += "Método: conversão para decimal, divisão e retorno para binário\n\n";
    explicacao += a + " (decimal " + decA + ") ÷ " + b + " (decimal " + decB + ")\n\n";
    explicacao += "Quociente decimal: " + quociente + " → binário: " + quociente.toString(2) + "\n";
    explicacao += "Resto decimal: " + resto + " → binário: " + resto.toString(2) + "\n\n";
    explicacao += "Resultado Final: Quociente = " + quociente.toString(2) + ", Resto = " + resto.toString(2);
    return explicacao;
}

// ==========================
// TABELA
// ==========================
function gerarTabela() {

    let html = "<table>";
    html += "<tr><th>Decimal</th><th>Binário</th><th>Octal</th><th>Hexadecimal</th></tr>";

    for (let i = 0; i <= 32; i++) {
        html += "<tr>";
        html += "<td>" + i + "</td>";
        html += "<td>" + i.toString(2) + "</td>";
        html += "<td>" + i.toString(8) + "</td>";
        html += "<td>" + i.toString(16).toUpperCase() + "</td>";
        html += "</tr>";
    }

    html += "</table>";

    document.getElementById("tabela").innerHTML = html;
}
