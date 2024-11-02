
let func;  // Variável para armazenar a função

function guardarFuncao() {
    const funcInput = document.getElementById("funcInput").value;

    try {
        // Usando math.js para interpretar a função como uma expressão matemática
        func = math.parse(funcInput).compile();
        alert("Função salva com sucesso!");
    } catch (error) {
        alert("Erro ao salvar a função.");
    }
}

function resultadoFuncao() {
    const xValue = parseFloat(document.getElementById("xInput").value);

    if (func) {
        try {
            // Avaliar a função para o valor de x usando math.js
            const result = func.evaluate({ x: xValue });
            document.getElementById("result").textContent = `f(${xValue}) = ${result}`;
        } catch (error) {
            document.getElementById("result").textContent = "Erro ao calcular a função.";
        }
    } else {
        alert("Por favor, insira e salve uma função primeiro.");
    }
}
