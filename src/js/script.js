window.onload = function () {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 1000);
};

let funcao;  // Variável para armazenar a função
let mensagem = document.getElementById("resultado-mensagem") // mensagem abaixo do botão exibir valores
let resultado = document.getElementById("resultado") // mensagem da raiz da função

const botaoValores = document.getElementById("btn-enviar");

botaoValores.addEventListener("click", (event) => {
    event.preventDefault();

    if (funcao) {
        let a = Number(document.getElementById("aInput").value);
        let b = Number(document.getElementById("bInput").value);
        let xi = Number(document.getElementById("xiInput").value);
        let xiMenos1 = Number(document.getElementById("xi-1Input").value);
        let iter = Number(document.getElementById("iterInput").value);
        let iterMax = Number(document.getElementById("iterMaxInput").value);
        let erro = document.getElementById("erroInput").value;
        if (erro != "") {
            erro = math.parse(erro).compile().evaluate();
        }

        const metodo = escolherMetodo()
        if (metodo === "falsa-posicao") {
            let [raiz, y, msg] = falsaPosicao(a, b, iter, iterMax, erro);

            mensagem.innerText = msg
            if (raiz != "") {
                resultado.innerText = "Raiz da função: " + raiz
            }

            document.querySelector(".mensagem").textContent = ""

            if (typeof (raiz) === "number") {
                grafico(raiz, y)
            }

        }

        if (metodo === "secante") {
            let [raiz, y, msg] = secante(xi, xiMenos1, iter, iterMax, erro);

            mensagem.innerText = msg
            if (raiz != "") {
                resultado.innerText = "Raiz da função: " + raiz
            }

            document.querySelector(".mensagem").textContent = ""

            if (typeof (raiz) === "number") {
                grafico(raiz, y)
            }
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
    try {
        const metodo = document.querySelector('input[name="metodo"]:checked').value;

        if (metodo == "falsa-posicao") {
            document.getElementById("falsa-posicao").style.display = "flex"
            document.getElementById("secante").style.display = "none"
        }
        if (metodo == "secante") {
            document.getElementById("secante").style.display = "flex"
            document.getElementById("falsa-posicao").style.display = "none"
        }

        return (metodo)
    } catch (error) {
        mensagem.innerText = "Escolha um método!"
    }
}

function falsaPosicao(a, b, iter, iterMax, erro) {
    let xAtual;
    let xAnterior;
    for (iter; iter <= iterMax; iter++) {
        let fa = resultadoFuncao(a);
        let fb = resultadoFuncao(b);
        xAnterior = xAtual;

        if (fa * fb < 0) {
            xAtual = (a * fb - b * fa) / (fb - fa);
            let fx = resultadoFuncao(xAtual);

            if (iter > 0) {
                if ((Math.abs(xAtual - xAnterior) / xAtual) * 100 < erro) {
                    return ([xAtual, fx, `Na ${iter}° iteração o erro é menor que o critério de parada: ${(Math.abs(xAtual - xAnterior) / xAtual)*100} < ${erro}`]);
                }
            }

            if (fa * fx < 0) {
                b = xAtual;
            } else if (fb * fx < 0) {
                a = xAtual;
            }

        } else {
            return (["", "", "Pontos inválidos, não possuem sinais opostos."]);
        }
    }

    return (["", "", `Número máximo de iterações atingido, porém o erro ainda é maior que o critério de parada: ${(Math.abs(xAtual - xAnterior) / xAtual)*100} > ${erro}`]);
}

function secante(xi, xiMenos1, iter, iterMax, erro) {
    let xiMais1;
    let parada;
    for (iter; iter <= iterMax; iter++) {
        let fxi = resultadoFuncao(xi);
        let fxiMenos1 = resultadoFuncao(xiMenos1);


        xiMais1 = xi - ((fxi) * (xi - xiMenos1)) / (fxi - fxiMenos1)
        let fxiMais1 = resultadoFuncao(xiMais1);

        parada = (Math.abs(xiMais1 - xi) / xiMais1) * 100

        if (parada < erro) {
            return ([xiMais1, fxiMais1, `Na ${iter}° iteração o erro é menor que o critério de parada: ${parada} < ${erro}`]);
        }

        xiMenos1 = xi
        xi = xiMais1
    }

    return (["", "", `Número máximo de iterações atingido, porém o erro ainda é maior que o critério de parada: ${parada} > ${erro}`]);
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
            marker: { color: 'red', size: 10 }, // Customizar a cor e tamanho
            text: `Ponto (${raiz}, ${y.toFixed(2)})`, // Exibir as coordenadas
            textposition: 'top center',
            hoverinfo: 'text'
        };

        const data = [trace1, mostrarRaiz]
        const layout = {
            xaxis: { range: [-5, 5] },  // Ajustar o range do eixo x
            yaxis: { range: [-1, 1] },  // Ajustar o range do eixo y
            showlegend: false
        };
        Plotly.newPlot('plot', data, layout, { scrollZoom: true, responsive: true });
    }
    catch (err) {
        console.error(err)
        alert(err)
    }
}