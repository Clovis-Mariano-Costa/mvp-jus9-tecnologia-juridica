function selecionarPerfil(nome){
  localStorage.setItem('perfilMVP', nome);
  location.href='app-painel.html';
}

function garantirAgendaNoMenuLateral(){
  const menus = document.querySelectorAll('aside nav, .sidebar nav, .side nav, .menu, .side-menu, .sidenav');
  menus.forEach((menu) => {
    const jaExiste = Array.from(menu.querySelectorAll('a')).some((link) => {
      const texto = (link.textContent || '').toLowerCase();
      const href = (link.getAttribute('href') || '').toLowerCase();
      return texto.includes('agenda') || href.includes('agenda.html') || href.includes('app-agenda.html');
    });
    if (jaExiste) return;

    const referencia = Array.from(menu.querySelectorAll('a')).find((link) => {
      const texto = (link.textContent || '').toLowerCase();
      return texto.includes('prazos') || texto.includes('processos') || texto.includes('daj');
    });

    const agenda = document.createElement('a');
    agenda.href = 'agenda.html';
    agenda.innerHTML = '<span>📅</span>Agenda';
    agenda.setAttribute('data-jus9-agenda-link', 'true');

    if (referencia && referencia.parentNode === menu) {
      referencia.insertAdjacentElement('afterend', agenda);
    } else {
      menu.appendChild(agenda);
    }
  });
}

document.addEventListener('DOMContentLoaded', garantirAgendaNoMenuLateral);
console.log('MVP Jus 9 carregado.');
