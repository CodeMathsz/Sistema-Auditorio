const tokenLogin = localStorage.getItem("token")

let title = document.title

const lista = getById('lista')
const cadastro = getById('cadastro')
const logs = getById('logs')
const agendamentos = getById('agendamentos')
const dashboard = getById('dashboard')
const perfil = getById('perfil')
const pendente = getById('pendentes')
console.log(pendente)
const logado = getById('logado')
const naoLogado = getById('naoLogado')
const nomeUsuario = getById('nomeUsuario')
const nivelUsuario = getById('nivelUsuario')
const btnExit = getById('exit')
const btnLogin = getById('login')

if (tokenLogin == null) {
  if (document.title.substring(0, 2) == 'Si') {
    lista.classList.add('hidden')
    cadastro.classList.add('hidden')
    /* logs.classList.add('hidden')
    dashboard.classList.add('hidden') */
    agendamentos.classList.add('hidden')
    logado.classList.add('hidden')
    pendente.classList.add('hidden')
  } else {
    window.location.href = redirectPageLogin()
  }
} else {
  logado.classList.remove('hidden')
  naoLogado.classList.add('hidden')

  const payload = parseJwt(tokenLogin)
  if (!payload.ativo) {
    localStorage.removeItem('token')
    window.location.href = redirectPageLogin()
  }

  nomeUsuario.innerHTML = payload.nome
  if (payload.nivel == 0) {
    nivelUsuario.innerHTML = 'Professor'
    lista.classList.add('hidden')
    cadastro.classList.add('hidden')
    /* logs.classList.add('hidden')
    dashboard.classList.add('hidden') */
    pendente.classList.add('hidden')
  } else {
    nivelUsuario.innerHTML = 'Administrador'
  }

  let sidebar = document.querySelector(".sidebar");
  let sidebarBtn = document.querySelector(".bx-menu");
  const homeContent = document.querySelector(".home-content");
  const logoName = document.querySelector(".logo_name");
  let widthWindow = window.innerWidth;
  console.log(sidebarBtn);
  if (widthWindow <= 400) {
    homeContent.classList.remove("hide");
    sidebarBtn.addEventListener("click", () => {
      sidebar.classList.toggle("close");
    });
  }

  let arrow = document.querySelectorAll(".arrow");
  if (widthWindow < 1600) {
    arrow[0].addEventListener("click", () => {
      if (lista.classList.contains('showMenu')) {
        lista.classList.remove('showMenu')
      } else {
        cadastro.classList.remove('showMenu')
        lista.classList.add('showMenu')
      }
    })
    arrow[1].addEventListener("click", () => {
      if (cadastro.classList.contains('showMenu')) {
        cadastro.classList.remove('showMenu')
      } else {
        lista.classList.remove('showMenu')
        cadastro.classList.add('showMenu')
      }
    })
  } else {
    arrow[0].addEventListener("click", () => {
      if (lista.classList.contains('showMenu')) {
        lista.classList.remove('showMenu')
      } else {
        lista.classList.add('showMenu')
      }
    })
    arrow[1].addEventListener("click", () => {
      if (cadastro.classList.contains('showMenu')) {
        cadastro.classList.remove('showMenu')
      } else {
        cadastro.classList.add('showMenu')
      }
    })
  }

}

btnExit.addEventListener("click", () => {
  localStorage.removeItem('token')
  window.location.href = redirectPageLogin()
})

btnLogin.addEventListener("click", () => {
  window.location.href = redirectPageLogin()
})

function getById(id) {
  return document.getElementById(id)
}

function redirectPageLogin() {
  if (document.title.substring(0, 1) == 'L' || document.title.substring(0, 1) == 'C') {
    return '../../login/login.html'
  } else if (document.title.substring(0, 2) == 'Si') {
    return 'pages/login/login.html'
  } else if (document.title.substring(0, 2) == 'Se') {
    return '../../login/login.html'
  }
  return 'Error'
}

/* função que decodifica o token */
function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};
