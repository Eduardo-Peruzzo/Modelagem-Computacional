window.onload = function() {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 1000);
};

let funcao;  // Variável para armazenar a função

const botaoValores = document.getElementById("btn-enviar");

botaoValores.addEventListener("click", (event) => {
    event.preventDefault();

    if (funcao) {
        let a = Number(document.getElementById("aInput").value);
        let b = Number(document.getElementById("bInput").value);
        let iter = Number(document.getElementById("iterInput").value);
        let iterMax = Number(document.getElementById("iterMaxInput").value);
        let erro = document.getElementById("erroInput").value;
        if (erro != "") {
            erro = math.parse(erro).compile().evaluate();
        }

        const metodo = escolherMetodo()
        if (metodo === "falsa-posicao") {
            let raiz = falsaPosicao(a, b, iter, iterMax, erro)[0];
            let y = falsaPosicao(a, b, iter, iterMax, erro)[1];

            let resultado = document.getElementById("resultado")
            resultado.innerText = "Raiz da função: " + raiz
            document.querySelector(".mensagem").textContent = ""
            console.log(raiz)
            if (typeof(raiz) === "number") {
                grafico(raiz, y)
            }
            
        }

        if (metodo === "secante") {
            let raiz = secante(a, b, iter, iterMax, erro)[0];
            let y = secante(a, b, iter, iterMax, erro)[1];

            let resultado = document.getElementById("resultado")
            resultado.innerText = "Raiz da função: " + raiz
            document.querySelector(".mensagem").textContent = ""

            grafico(raiz, y)
        }


    } else {
        document.querySelector(".mensagem").classList.add("falha")
        document.querySelector(".mensagem").classList.remove("sucesso")
        document.querySelector(".mensagem").textContent = "Insira uma função!"
    }


})

function guardarFuncao() {
    const funcaoInput = document.getElementById("funcaoInput").value;

    try {
        // Usando math.js para interpretar a função como uma expressão matemática
        if (funcaoInput == "") {
            document.querySelector(".mensagem").classList.add("falha")
            document.querySelector(".mensagem").classList.remove("sucesso")
            document.querySelector(".mensagem").textContent = "Insira uma função!"
        } else {
            funcao = math.parse(funcaoInput).compile();
            document.querySelector(".mensagem").classList.add("sucesso")
            document.querySelector(".mensagem").classList.remove("falha")
            document.querySelector(".mensagem").textContent = "Função salva com sucesso!"
        }

    } catch (error) {
        alert("Erro ao salvar a função.");
    }
}

function resultadoFuncao(valor) {
    if (funcao) {
        try {
            // Avaliar a função para o valor de x usando math.js
            const result = funcao.evaluate({ x: valor });
            return (result);
        } catch (error) {
            document.getElementById("resultado").textContent = "Erro ao calcular a função.";
        }
    } else {
        alert("Por favor, insira e salve uma função primeiro.");
    }
}

function escolherMetodo() {
    const metodo = document.querySelector('input[name="metodo"]:checked').value;
    return(metodo)
}

function falsaPosicao(a, b, iter, iterMax, erro) {
    let xAtual;
    let xAnterior;
    for (iter; iter <= iterMax; iter++) {
        let fa = resultadoFuncao(a);
        let fb = resultadoFuncao(b);

        if (fa * fb < 0) {
            xAtual = (a * fb - b * fa) / (fb - fa);
            let fx = resultadoFuncao(xAtual);

            if (iter > 0) {
                if (Math.abs(xAtual - xAnterior) / xAtual < erro) {
                    return ([xAtual, fx]);
                }
            }

            xAnterior = xAtual;

            if (fa * fx < 0) {
                b = xAtual;
            } else if (fb * fx < 0) {
                a = xAtual;
            }

        } else {
            return (["Pontos inválidos, não possuem sinais opostos."]);
        }
    }

    return (["Número máximo de iterações atingido."]);
}

function secante(a, b, iter, iterMax, erro) {

}

function grafico(raiz, y) {
    try {
        const expr = funcao;

        const xValues = math.range(-10, 10, 0.01).toArray();
        const yValues = xValues.map(function (x) {
            return expr.evaluate({ x: x });
        })

        const trace1 = {
            x: xValues,
            y: yValues,
            type: 'scatter'
        };

        const mostrarRaiz = {
            x: [raiz],
            y: [y],
            mode: 'markers+text',
            marker: { color: 'red', size: 10 }, // Customize a cor e tamanho
            text: `Ponto (${raiz}, ${y.toFixed(2)})`, // Exibir as coordenadas
            textposition: 'top center',
            hoverinfo: 'text'
        };

        const data = [trace1, mostrarRaiz]
        const layout = {
            xaxis: { range: [-5, 5] },  // Ajuste o range do eixo x
            yaxis: { range: [-1, 1] },  // Ajuste o range do eixo y
            showlegend: false
        };
        Plotly.newPlot('plot', data, layout, { scrollZoom: true, responsive: true });
    }
    catch (err) {
        console.error(err)
        alert(err)
    }
}