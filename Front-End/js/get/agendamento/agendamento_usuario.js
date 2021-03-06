/* METHOD GET ---------------------------------------------------------*/
/* pegando os elementos com id */
/* pegando a tabela */
const table = getById("tabela");
/* pegando o tbody */
const tbody = getById("tbody");
/* pegando a modal de alteração */
const modalAlterar = getById("modalAlterar");
const modalInfo = getById("modalInfo");
const tituloAgendamento = getById("tituloAgendamento");
console.log(tituloAgendamento);
const descricaoAgendamento = getById("descricaoAgendamento");
const tipoAgendamento = getById("tipoAgendamento");
const dataAgendamento = getById("dataAgendamento");
const horaAgendamento = getById("horaAgendamento");
const periodoAgendamento = getById("periodoAgendamento");
const statusAgendamento = getById("statusAgendamento");
const usuarioAgendamento = getById("usuarioAgendamento");
/* pegando os inputs pelo id */
const form = getById("form");
const titulo = getById("titulo");
const descricao = getById("descricao");
const dataInicio = getById("dataInicio");
const dataFinalizada = getById("dataFinalizada");
var dataAtual = new Date(Date.now());
var hoje = dataAtual
  .toLocaleDateString()
  .replace(/(\d*)\/(\d*)\/(\d*).*/, "$3-$2-$1");
dataAtual.setDate(dataAtual.getDate() + 3);
var dataAposAtual = dataAtual
  .toLocaleDateString()
  .replace(/(\d*)\/(\d*)\/(\d*).*/, "$3-$2-$1");
var dataAposAtualFormat = dataAposAtual.replace(
  /(\d*)-(\d*)-(\d*).*/,
  "$3/$2/$1"
);
dataInicio.min = dataAposAtual;
const tipo = getById("tipo");
const submit = getById("submit");

/* pegando o token do usuario */
const token = localStorage.getItem("token");
const payload = parseJwt(token);

/* MENSAGEM */
const mensagens = getById("mensagens");
let type = "";
let idMessage = 0;

if (token == null) {
  window.location.href = "../../index.html";
} else {
  const url = `http://10.92.198.22:8080/api/agendamento/usuario/${payload.id}`;
  getAgendamento(url);
}

/* método que faz a conexão com a api que traz todos os agendamentos */
/* método que faz a conexão com a api que traz todos os agendamentos */
function getAgendamento(url) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", token);

  /* construindo o fetchData, indicando o método que vamos usar e colocando o objeto json que criamos no corpo do fetch */
  let fetchData = {
    method: "GET",
    headers: myHeaders,
  };
  /* fazendo conexão com a url fornecida */
  fetch(url, fetchData)
    .then((resp) => {
      resp
        .json()
        .then((data) => {
          console.log(data);
          /* fazendo um forEach no array de agendamentos */
          /* para cada agendamento ele cria um objeto agendamento */
          let i = 0;
          return data.map((agendamento) => {
            /* método que cria o tbody */
            createTbody(agendamento, i);
            i++;
          });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
}

function createTbody(agendamento, index) {
  /* criando a tr dentro do tbody */
  const tr = createNode("tr");
  if (index % 2 == 1) {
    tr.style.backgroundColor = "#f0f0f0";
  }
  /* criando as tds e colocando seus respectivos valores */
  let tdId = createNode("td");
  tdId.innerHTML = `${agendamento.id}`;

  let tdTitulo = createNode("td");
  tdTitulo.innerHTML = `${agendamento.title.substring(0, 20)}...`;

  /* let tdDescricao = createNode('td')
    tdDescricao.innerHTML = `${agendamento.descricao.substring(0, 15)}...` */

  let tdData = createNode("td");
  /* formatando a data para padrão brasileiro */
  const dataInicioFormat = agendamento.dataInicioFormat.replace(
    /(\d*)-(\d*)-(\d*).*/,
    "$3/$2/$1"
  );
  const dataFinalizadaFormat = agendamento.dataFinalizadaFormat.replace(
    /(\d*)-(\d*)-(\d*).*/,
    "$3/$2/$1"
  );
  if (dataInicioFormat == dataFinalizadaFormat) {
    tdData.innerHTML = `${dataInicioFormat}`;
  } else {
    tdData.innerHTML = `${dataInicioFormat} - ${dataFinalizadaFormat}`;
  }

  /* formatando a data para padrão brasileiro */

  let tdHora = createNode("td");
  tdHora.innerHTML = `${agendamento.horaInicio} - ${agendamento.horaFinalizada}`;

  let tdStatus = createNode("td");
  let divStatus = createNode("div");
  divStatus.classList.add("status");
  let divSpanStatus = createNode("div");
  divSpanStatus.classList.add("spanStatus");
  let spanStatus = createNode("span");
  if (agendamento.status == "PENDENTE") {
    /* AMARELO */
    pintaStatus(divStatus, divSpanStatus, spanStatus, "#fff9c4", "#fbc02d");
  } else if (agendamento.status == "RECUSADO") {
    /* VERMELHO */
    pintaStatus(divStatus, divSpanStatus, spanStatus, "#ef9a9a", "#d32f2f");
  } else if (agendamento.status == "ACEITO") {
    /* VERDE */
    pintaStatus(divStatus, divSpanStatus, spanStatus, "#c8e6c9", "#388e3c");
  } else {
    /* AZUL */
    pintaStatus(divStatus, divSpanStatus, spanStatus, "#b3e5fc", "#0288d1");
  }
  spanStatus.innerHTML = `${agendamento.status.substring(
    0,
    1
  )}${agendamento.status.substring(1, 10).toLowerCase()}`;

  let tdAlterar = createNode("td");
  /* cria o botao de alteração */
  const btnAlterar = createNode("button");
  btnAlterar.className = "btnAlterar";
  let iAlterar = createNode("i");
  iAlterar.classList.add("bx");
  iAlterar.classList.add("bxs-edit-alt");
  iAlterar.classList.add("alterar");

  /* VARIAVEL PARA O PERIODO */
  let periodo = agendamento.periodo;
  console.log(periodo)

  /* ID DO AGENDAMENTO */
  const valor = agendamento.id;
  console.log(valor);

  /* status do agendamento */
  const status = agendamento.status;
  const horaInicio = agendamento.horaInicio;
  console.log(horaInicio);
  const horaFinalizada = agendamento.horaFinalizada;
  console.log(horaFinalizada);

  let show = false;
  btnAlterar.addEventListener("click", () => {
    if (show === false) {
      modalAlterar.classList.add("showModal");
      show = true;
    }

    /* Preencher os inputs do formulario de cadastro, mas vamos alterar! */
    titulo.value = agendamento.title;
    descricao.value = agendamento.descricao;
    dataInicio.addEventListener("change", () => {
      console.log(dataInicio.value + "#########################");
      dataFinalizada.min = dataInicio.value;
      dataFinalizada.value = dataInicio.value;
    });
    dataInicio.value = agendamento.dataInicioFormat;
    dataFinalizada.value = agendamento.dataFinalizadaFormat;
    dataFinalizada.min = dataInicio.value;

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", token);

    /* construindo o fetchData, indicando o método que vamos usar e colocando o objeto json que criamos no corpo do fetch */
    let fetchData = {
      method: "GET",
      headers: myHeaders,
    };
    /* METOD GET ------------------ */
    /* Preenchendo o select do tipo */
    /* Url da lista do tipo */
    const urlTipo = "http://10.92.198.22:8080/api/tipo";
    /* variavel que pega o select do html */
    const select = tipo;
    select.innerText = ""
    /* fazendo conexão com a api */
    fetch(urlTipo, fetchData)
      .then((resp) => {
        resp
          .json()
          .then((data) => {
            /* dando um nome para o objeto */
            let tipos = data;
            /* fazendo tipo um forEach por cada tipo */
            return tipos.map((tipo) => {
              /* criando um elemento option */
              let option = createNode("option");
              /* colocando no valor desse option o id do tipo */
              option.value = tipo.id;
              /* colocando no texto desse option o nome do tipo */
              option.innerHTML = tipo.nome;

              /* falando que o option é filho do select */
              append(select, option);
            });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });

    tipo.value = agendamento.tipo.nome;

    /* METODO POST ------------------------------------ */
    form.addEventListener("submit", function () {
      /* evento para nao submeter o formulario */
      event.preventDefault();
      /* url que faz a conexão com a api do back-end */
      const urlAgendamento = `http://10.92.198.22:8080/api/agendamento/${valor}`;

      const dataInicioCompleta = dataInicio.value + "T" + horaInicio + ":00";
      const dataFinalizadaCompleta =
        dataFinalizada.value + "T" + horaFinalizada + ":00";

      /* construindo o objeto agendamento */
      let agendamento = {
        id: valor,
        title: titulo.value,
        descricao: descricao.value,
        start: dataInicioCompleta,
        end: dataFinalizadaCompleta,
        periodo: periodo,
        status: status,
        tipo: {
          id: tipo.value,
        },
        usuario: {
          id: payload.id,
        },
      };

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", token);

      /* construindo o fetchData, indicando o método que vamos usar e colocando o objeto json que criamos no corpo do fetch */
      let fetchData = {
        method: "PUT",
        body: JSON.stringify(agendamento),
        headers: myHeaders,
      };

      /* fazendo a conexão com a api */
      fetch(urlAgendamento, fetchData)
        .then((resp) => {
          console.log(resp);
          resp
            .json()
            .then((resposta) => {
              console.log(resposta);
              if (resposta.error == "OK") {
                if (show === true) {
                  modalAlterar.classList.remove("showModal");
                  show = false;
                }
                console.log("sucesso");
                type = "success";
                createMessage("Sucesso ao alterar o agendamento!", type);
                setTimeout(() => {
                  window.location.reload();
                }, 3000);
              } else {
                console.log("erro");
                type = "error";
                createMessage(
                  "Falha ao alterar agendamento: " + resposta.message,
                  type
                );
              }
              deleteMessage();
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    });

    const btnFecharModalAlterar = getById("close");
    btnFecharModalAlterar.addEventListener("click", () => {
      if (show === true) {
        modalAlterar.classList.remove("showModal");
        show = false;
      }
    });
  });

  let tdDeletar = createNode("td");
  /* cria o botao de alteração */
  const btnDeletar = createNode("button");
  btnDeletar.classList.add("btnDeletar");
  let iDeletar = createNode("i");
  iDeletar.classList.add("bx");
  iDeletar.classList.add("bxs-trash-alt");
  iDeletar.classList.add("deletar");

  btnDeletar.addEventListener("click", () => {
    const urlAgendamento = `http://10.92.198.22:8080/api/agendamento/${valor}`;
    const resultado = confirm(`Deseja deletar o agendamento do id: ${valor}?`);
    if (resultado == true) {
      /* construindo o objeto agendamento */
      let agendamento = {
        id: valor,
      };

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", token);

      /* contruindo o fetchData, indicando o método que vamos usar e colocando o objeto json que criamos no corpo do fetch */
      let fetchData = {
        method: "DELETE",
        body: JSON.stringify(agendamento),
        headers: myHeaders,
      };
      fetch(urlAgendamento, fetchData)
        .then((resp) => {
          resp
            .json()
            .then((resposta) => {
              if (resposta.error == "OK") {
                console.log("sucesso");
                createMessage(
                  `Sucesso ao excluir o agendamento: ${valor}!`,
                  "success"
                );
                setTimeout(() => {
                  window.location.reload();
                }, 3000);
              } else {
                console.log("erro");
                createMessage(
                  `Falha ao excluir o agendamento: ${valor}, ` +
                    resposta.message,
                  "error"
                );
              }
              deleteMessage();
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });

  let tdVerMais = createNode("td");
  tdVerMais.classList.add("verMais");
  let iVerMais = createNode("i");
  iVerMais.classList.add("bx");
  iVerMais.classList.add("bx-dots-vertical-rounded");

  iVerMais.addEventListener("click", () => {
    if (show == false) {
      modalInfo.classList.add("showModal");
      show = true;
      if (agendamento.periodo == "MANHA") {
        periodo = "Manhã";
      } else if (agendamento.periodo == "TARDE") {
        periodo = "Tarde";
      } else if (agendamento.periodo == "NOITE") {
        periodo = "Noite";
      } else if (agendamento.periodo == "MANHA_TARDE") {
        periodo = "Manhã e Tarde";
      } else if (agendamento.periodo == "TARDE_NOITE") {
        periodo = "Tarde e Noite";
      } else {
        periodo = "Manhã, Tarde e Noite";
      }
      tituloAgendamento.innerHTML = agendamento.title;
      console.log(agendamento.title)
      descricaoAgendamento.innerHTML = agendamento.descricao;
      console.log(agendamento.descricao)
      tipoAgendamento.innerHTML = "Tipo: " + agendamento.tipo.nome;
      statusAgendamento.innerHTML = "Status: " + spanStatus.innerHTML;
      dataAgendamento.innerHTML = "Data: " + tdData.innerHTML;
      horaAgendamento.innerHTML = "Horario: " + tdHora.innerHTML;
      periodoAgendamento.innerHTML = "Periodo: " + periodo;
      usuarioAgendamento.innerHTML = "Usuario: " + agendamento.usuario.nome;
    }
    const btnFecharModalInfo = getById("closeInfo");
    btnFecharModalInfo.addEventListener("click", () => {
      if (show === true) {
        modalInfo.classList.remove("showModal");
        show = false;
      }
    });
  });

  /* apontando quem é filho de quem para que a construção do tbody seja feita com sucesso */
  append(table, tbody);
  append(tbody, tr);
  append(tr, tdId);
  append(tr, tdTitulo);
  /* append(tr, tdDescricao) */
  append(tr, tdData);
  append(tr, tdHora);
  append(tr, tdStatus);
  append(tdStatus, divStatus);
  append(divStatus, divSpanStatus);
  append(divStatus, spanStatus);
  /* append(tr, tdPeriodo) */
  /* append(tr, tdTipo) */
  append(tr, tdAlterar);
  append(tdAlterar, btnAlterar);
  append(btnAlterar, iAlterar);
  append(tr, tdDeletar);
  append(tdDeletar, btnDeletar);
  append(btnDeletar, iDeletar);
  append(tr, tdVerMais);
  append(tdVerMais, iVerMais);
}

/* função que limpa o tbody */
function clearTbody() {
  tbody.innerText = "";
}

function pintaStatus(background, elipse, span, backgroundColor, textColor) {
  background.style.backgroundColor = backgroundColor;
  elipse.style.backgroundColor = textColor;
  span.style.color = textColor;
}

function createMessage(msg, type) {
  idMessage++;
  let message = createNode("div");
  message.classList.add("message");
  message.id = "message" + idMessage;

  let messageContent = createNode("div");
  messageContent.classList.add("msg-content");

  let i = createNode("i");
  i.classList.add("bx");
  i.classList.add("bx-tada");
  if (type == "success") {
    i.classList.add("bx-check");
    i.style.color = "green";
  } else {
    i.classList.add("bx-x");
    i.style.color = "rgb(255, 11, 27)";
  }

  let p = createNode("p");
  p.innerHTML = msg;

  append(message, messageContent);
  append(messageContent, i);
  append(messageContent, p);

  let time = createNode("div");
  time.classList.add("msgTempo");

  let timeBar = createNode("div");
  timeBar.classList.add("barraTempo");

  append(message, time);
  append(time, timeBar);
  append(mensagens, message);
}

function deleteMessage() {
  console.log(idMessage);
  for (let i = 0; i <= idMessage; i++) {
    let element = getById("message" + i);
    if (element != null) {
      setTimeout(() => {
        mensagens.removeChild(element);
      }, 3000);
    } else {
      continue;
    }
  }
}

/* função que limpa qualquer elemento */
function clearElement(element) {
  element.innerText = "";
}

/* método que pega os elementos pelo id */
function getById(id) {
  return document.getElementById(id);
}

/* método que cria um elemento */
function createNode(element) {
  return document.createElement(element);
}

/* método que indica quem é filho de quem */
function append(parent, el) {
  return parent.appendChild(el);
}

/* função que decodifica o token */
function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
