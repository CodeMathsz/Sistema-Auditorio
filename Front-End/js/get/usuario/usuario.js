/* METHOD GET ---------------------------------------------------------*/
/* pegando os elementos com id */
/* input da busca */
const id = getById("id");
/* pegando o valor do input da busca */
let valor = id.value;
/* pegando a tabela */
const table = getById("tabela");
/* pegando o tbody */
const tbody = getById("tbody");
/* pegando a modal de alteração */
const modalAlterar = getById("modalAlterar");

/* pegando o botao que faz a procura */
/* const botaoProcurar = getById("search"); */

/* pegando o token do usuario */
const token = localStorage.getItem("token");
const payload = parseJwt(token);

let url = ''

if (token == null) {
  window.location.href = "../../login/login.html";
} else {
  if (payload.nivel == 1) {
    /* adiciona um escutador de evento ao meu botão, que no caso é o evento de click */
    url = 'http://10.92.198.22:8080/api/usuario'
    get(url)
  } else {
    window.location.href = "../../../index.html";
  }
}
/* método que faz a conexão com a api que traz todos os usuarios */
function get(url) {
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
          /* fazendo um forEach no array de usuarios */
          /* para cada usuario ele cria um objeto usuario */
          let i = 0
          return data.map((usuario) => {
            /* método que cria o tbody */
            createTbody(usuario, i);
            i++
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

/* método que cria tudo dentro do tbody */
/* cria as tr, e as tds e coloca os valores do objeto usuario dentro de seu respectivo campo*/
function createTbody(usuario, index) {
  /* criando a tr dentro do tbody */
  const tr = createNode("tr");

  if (index % 2 == 1) {
    tr.style.backgroundColor = "#f0f0f0";
  }

  /* criando as tds e colocando seus respectivos valores */
  let tdId = createNode("td");
  tdId.innerHTML = `${usuario.id}`;

  let tdNome = createNode("td");
  tdNome.innerHTML = `${usuario.nome}`;

  let tdEmail = createNode("td");
  tdEmail.innerHTML = `${usuario.email}`;

  let tdNif = createNode("td");
  tdNif.innerHTML = `${usuario.nif}`;

  let tdNivel = createNode("td")
  let nivel = '';
  if (usuario.nivel == "ADMINISTRADOR") {
    nivel = 'Administrador';
  } else {
    nivel = 'Professor'
  }
  tdNivel.innerHTML = nivel;

  let tdAlterar = createNode("td");
  /* cria o botao de alteração */
  const btnAlterar = createNode("button");
  btnAlterar.innerHTML = "Alterar";

  let show = false;
  btnAlterar.addEventListener("click", () => {
    if (show === false) {
      modalAlterar.classList.add("show");
      show = true;

      /* pegando os inputs pelo id */
      const form = getById("form");
      const id = getById("id");
      const nome = getById("nome");
      const email = getById("email");
      const nif = getById("nif");
      const nivel = getById("nivel");
      const senha = getById("senha");
      const confirmaSenha = getById("confirmaSenha");

      /* Preenchendo o formulario com id fornecido */
      /* colocando o valor do respectivo usuario pelo input do id */
      id.value = usuario.id;

      /* pegando o valor que acabamos de colocar */
      const valor = id.value;

      /* url do usuario com o valor do input do id */
      const urlusuario = `http://10.92.198.22:8080/api/usuario/${valor}`;

      /* fazendo conexão com a api */
      fetch(urlusuario)
        /* transformando a resposta em json */
        .then((resp) => resp.json())
        .then((data) => {
          /* pegando os valores do json e colocando nos inputs */
          nome.value = data.nome;
          email.value = data.email;
          nif.value = data.nif;
          nivel.value = data.nivel;
        })
        .catch((error) => {
          console.log(error);
        });

      /* METODO PUT ------------------------------------ */
      /* pegando as informações alteradas do formulario e fazendo a alteração pelo método put */

      /* adicionando um evento submit no form */
      form.addEventListener("submit", function () {
        /* evitando que ele submeta */
        event.preventDefault();

        if (senha.value == confirmaSenha.value) {
          /* url do usuario com o valor do input do id */
          const urlUsuario = `http://10.92.198.22:8080/api/usuario/${valor}`;

          /* construindo o objeto usuario */
          let usuario = {
            id: valor,
            nome: nome.value,
            email: email.value,
            nif: nif.value,
            nivel: nivel.value,
            senha: senha.value,
          };

          const myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          /* contruindo o fetchData, indicando o método que vamos usar e colocando o objeto json que criamos no corpo do fetch */
          let fetchData = {
            method: "PUT",
            body: JSON.stringify(usuario),
            headers: myHeaders,
          };

          /* fazendo a conexão com a api */
          fetch(urlusuario, fetchData)
            .then((resp) => {
              resp.json();
              console.log(resp);
              window.location.reload();
            })
            .then((resposta) => {
              console.log(resposta);
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          alert("Senhas não compativeis");
        }
      });
    }

    const btnFecharModal = getById("close");
    btnFecharModal.addEventListener("click", () => {
      if (show === true) {
        modalAlterar.classList.remove("show");
        show = false;
      }
    });
  });

  let tdDesativar = createNode("td");
  /* cria o botao de alteração */
  const btnDesativar = createNode("button");
  btnDesativar.innerHTML = "Desativar";

  btnDesativar.addEventListener("click", () => {
    const valor = tdId.innerHTML;

    const urlusuario = `http://10.92.198.22:8080/api/usuario/${valor}`;
    const resultado = confirm(`Deseja deletar o usuario do id: ${valor}?`);
    if (resultado == true) {
      /* construindo o objeto usuario */
      let usuario = {
        id: valor,
      };

      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      /* contruindo o fetchData, indicando o método que vamos usar e colocando o objeto json que criamos no corpo do fetch */
      let fetchData = {
        method: "DELETE",
        body: JSON.stringify(usuario),
        headers: myHeaders,
      };
      fetch(urlusuario, fetchData)
        .then((resp) => resp.json())
        .then((data) => {
          alert("O usuario foi excluido.");
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });

  /* apontando quem é filho de quem para que a construção do tbody seja feita com sucesso */
  append(table, tbody);
  append(tbody, tr);
  append(tr, tdId);
  append(tr, tdNome);
  append(tr, tdEmail);
  append(tr, tdNif);
  append(tr, tdNivel);
  append(tdAlterar, btnAlterar);
  append(tr, tdAlterar);
  append(tdDeletar, btnDeletar);
  append(tr, tdDeletar);
}

/* função que limpa o tbody */
function clearTbody() {
  tbody.innerText = "";
}

/* função que cria o elemento */
function createNode(element) {
  return document.createElement(element);
}

/* função que aponta quem é filho de quem */
function append(parent, el) {
  return parent.appendChild(el);
}

/* função para pegar um elemento pelo id */
function getById(id) {
  return document.getElementById(id);
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
