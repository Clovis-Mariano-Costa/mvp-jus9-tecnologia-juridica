
const JUS9 = {
  links: {
    equipe: 'https://www.jus9tecnologia.com.br/equipe/',
    investidores: 'https://investimentos.jus9tecnologia.com.br/',
    charlie: 'https://charlieecho.jus9tecnologia.com.br/',
    social: 'https://jus9verde.jus9tecnologia.com.br/charlie-echo-social#chat-social',
    privacidade: 'https://www.jus9tecnologia.com.br/privacidade.html',
    termos: 'https://www.jus9tecnologia.com.br/termos.html',
    contato: 'mailto:Contato@jus9tecnologia.com.br'
  }
};
function go(path){ window.location.href = path; }
function saveLogin(){
  const user=document.querySelector('#usuario')?.value?.trim();
  const pass=document.querySelector('#senha')?.value?.trim();
  if(!user || !pass){ alert('Informe usuário e senha para prosseguir.'); return; }
  localStorage.setItem('jus9_usuario', user);
  localStorage.setItem('jus9_logado', 'true');
  if(localStorage.getItem('jus9_cadastro_lider')==='true') go('perfis.html');
  else go('perfis.html?novo=1');
}
function selecionarPerfil(perfil){
  localStorage.setItem('jus9_perfil', perfil);
  if(localStorage.getItem('jus9_cadastro_lider')==='true') go('perfis/'+perfil+'.html');
  else go('cadastro-lider.html?perfil='+encodeURIComponent(perfil));
}
function cadastrarLider(){
  const nome=document.querySelector('#nome')?.value?.trim();
  const email=document.querySelector('#email')?.value?.trim();
  const perfil=new URLSearchParams(location.search).get('perfil') || localStorage.getItem('jus9_perfil') || 'professor-mestre-doutor';
  if(!nome || !email){ alert('Preencha nome e e-mail do Cadastro Líder.'); return; }
  localStorage.setItem('jus9_cadastro_lider','true');
  localStorage.setItem('jus9_lider_nome',nome);
  localStorage.setItem('jus9_lider_email',email);
  go('perfis/'+perfil+'.html');
}
function criarEvento(){
  const e={id:Date.now(), perfil:localStorage.getItem('jus9_perfil')||'geral', tipo:document.querySelector('#tipo')?.value||'evento', titulo:document.querySelector('#titulo')?.value||'Evento Jus 9', data:document.querySelector('#data')?.value||new Date().toISOString().slice(0,10), hora:document.querySelector('#hora')?.value||'09:00', descricao:document.querySelector('#descricao')?.value||''};
  const arr=JSON.parse(localStorage.getItem('jus9_agenda')||'[]'); arr.push(e); localStorage.setItem('jus9_agenda',JSON.stringify(arr)); renderAgenda();
}
function renderAgenda(){
  const box=document.querySelector('#agenda-lista'); if(!box) return;
  const arr=JSON.parse(localStorage.getItem('jus9_agenda')||'[]');
  box.innerHTML = arr.length ? arr.map(e=>`<div class="card"><strong>${e.titulo}</strong><br><span class="muted">${e.tipo} · ${e.data} ${e.hora} · ${e.perfil}</span><p>${e.descricao||''}</p></div>`).join('') : '<p class="muted">Nenhum evento cadastrado ainda.</p>';
}
function baixar(nome, conteudo, tipo='text/plain'){
  const blob=new Blob([conteudo],{type:tipo}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=nome; a.click(); URL.revokeObjectURL(a.href);
}
function exportJSON(){ baixar('agenda-jus9.json', localStorage.getItem('jus9_agenda')||'[]','application/json'); }
function exportICS(){
  const arr=JSON.parse(localStorage.getItem('jus9_agenda')||'[]');
  const body=arr.map(e=>`BEGIN:VEVENT
UID:${e.id}@jus9
DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').split('.')[0]}Z
SUMMARY:${e.titulo}
DESCRIPTION:${e.descricao}
DTSTART:${(e.data||'2026-01-01').replace(/-/g,'')}T${(e.hora||'09:00').replace(':','')}00
END:VEVENT`).join('
');
  baixar('agenda-jus9.ics',`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Jus9//Agenda MVP//PT-BR
${body}
END:VCALENDAR`,'text/calendar');
}
function limparAgenda(){ if(confirm('Limpar agenda local deste navegador?')){ localStorage.removeItem('jus9_agenda'); renderAgenda(); } }
document.addEventListener('DOMContentLoaded', renderAgenda);
