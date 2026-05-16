
(function(){
  const profiles={
    'advogado-defensor':'perfil-advogado.html',
    'professor':'perfil-professor.html',
    'estudante':'perfil-estudante.html',
    'cidadao':'perfil-cidadao.html',
    'perito-judicial':'perfil-perito-judicial.html',
    'investidor-parceiro':'perfil-investidor.html',
    'escritorio-juridico':'perfil-escritorio.html',
    'empresa-juridico-interno':'perfil-empresa.html',
    'orgao-publico':'perfil-orgao-publico.html',
    'administrador-jus9':'perfil-administrador.html',
    'juiz-magistrado':'perfil-juiz.html',
    'promotor-ministerio-publico':'perfil-promotor.html',
    'delegado-autoridade-policial':'perfil-delegado.html'
  };
  const names={
    'advogado-defensor':'Advogado(a) ou Defensor(a) Público(a)',
    'professor':'Professor(a)',
    'estudante':'Estudante',
    'cidadao':'Cidadão / Interessado',
    'perito-judicial':'Perito Judicial',
    'investidor-parceiro':'Investidor / Parceiro',
    'escritorio-juridico':'Escritório Jurídico',
    'empresa-juridico-interno':'Empresa / Jurídico Interno',
    'orgao-publico':'Órgão Público / Instituição',
    'administrador-jus9':'Administrador Jus 9',
    'juiz-magistrado':'Juiz / Magistrado',
    'promotor-ministerio-publico':'Promotor / Ministério Público',
    'delegado-autoridade-policial':'Delegado / Autoridade Policial'
  };
  window.mvpProfiles=profiles;
  function $(id){return document.getElementById(id)}
  function getUsers(){ try{return JSON.parse(localStorage.getItem('jus9UsuariosMvp')||'{}')}catch(e){return {}} }
  function saveUsers(u){ localStorage.setItem('jus9UsuariosMvp', JSON.stringify(u)); }
  function currentUser(){ return localStorage.getItem('jus9UsuarioAtual') || ''; }
  window.escolherPerfil=function(slug){ localStorage.setItem('perfilMVP', slug); localStorage.setItem('perfilMVPNome', names[slug]||slug); const u=currentUser(); const users=getUsers(); if(u && users[u]){ location.href=profiles[slug]||'app-painel.html'; } else { location.href='cadastro.html'; } }
  window.limparSessaoMVP=function(){ localStorage.removeItem('jus9UsuarioAtual'); localStorage.removeItem('perfilMVP'); localStorage.removeItem('perfilMVPNome'); location.href='login.html'; }
  document.addEventListener('DOMContentLoaded',()=>{
    const login=$('formLogin');
    if(login){ login.addEventListener('submit',e=>{ e.preventDefault(); const usuario=($('usuario')||{}).value?.trim(); const senha=($('senha')||{}).value?.trim(); if(!usuario||!senha){ $('statusLogin').textContent='Informe usuário e senha para continuar.'; return; } localStorage.setItem('jus9UsuarioAtual', usuario); location.href='perfis.html'; }); }
    const cadastro=$('formCadastro');
    if(cadastro){ const perfil=localStorage.getItem('perfilMVP')||'professor'; const perfilNome=localStorage.getItem('perfilMVPNome')||names[perfil]||perfil; const alvo=$('perfilCadastro'); if(alvo) alvo.textContent=perfilNome; cadastro.addEventListener('submit',e=>{ e.preventDefault(); const usuario=currentUser()||(($('cadUsuario')||{}).value||'usuario').trim(); const users=getUsers(); users[usuario]={nome:($('nomeCompleto')||{}).value||usuario,email:($('email')||{}).value||'',perfil,perfilNome,criadoEm:new Date().toISOString()}; saveUsers(users); localStorage.setItem('jus9UsuarioAtual', usuario); location.href=profiles[perfil]||'app-painel.html'; }); }
    const badge=$('perfilAtual'); if(badge){ badge.textContent=localStorage.getItem('perfilMVPNome')||'Perfil não selecionado'; }
    const userBadge=$('usuarioAtual'); if(userBadge){ userBadge.textContent=currentUser()||'Usuário não identificado'; }
    initAgenda();
  });
  function initAgenda(){
    const form=$('formAgenda'); if(!form) return;
    const list=$('listaAgenda');
    function load(){ try{return JSON.parse(localStorage.getItem('jus9AgendaEventos')||'[]')}catch(e){return []} }
    function save(items){ localStorage.setItem('jus9AgendaEventos', JSON.stringify(items)); }
    function render(){ const items=load(); if(!items.length){ list.innerHTML='<p class="muted">Nenhum evento registrado nesta agenda local.</p>'; return; } list.innerHTML=items.map((ev,i)=>`<div class="agenda-item"><strong>${ev.titulo}</strong><br><span class="pill">${ev.perfil}</span><span class="pill">${ev.tipo}</span><span class="pill">${ev.data} ${ev.hora||''}</span><p>${ev.descricao||''}</p><button class="btn" onclick="removerEventoAgenda(${i})">Remover</button></div>`).join(''); }
    window.removerEventoAgenda=function(i){ const items=load(); items.splice(i,1); save(items); render(); }
    form.addEventListener('submit',e=>{ e.preventDefault(); const items=load(); items.push({id:'agenda-'+Date.now(),perfil:($('agendaPerfil')||{}).value,tipo:($('agendaTipo')||{}).value,titulo:($('agendaTitulo')||{}).value,data:($('agendaData')||{}).value,hora:($('agendaHora')||{}).value,descricao:($('agendaDescricao')||{}).value,status:'pendente'}); save(items); form.reset(); render(); });
    window.exportarAgendaJson=function(){ const blob=new Blob([JSON.stringify(load(),null,2)],{type:'application/json'}); downloadBlob(blob,'agenda-jus9.json'); }
    window.exportarAgendaIcs=function(){ const items=load(); const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Jus 9 Tecnologia Jurídica//Agenda Jus 9//PT-BR']; items.forEach(ev=>{ const dt=(ev.data||'').replace(/-/g,'')+'T'+((ev.hora||'09:00').replace(':',''))+'00'; lines.push('BEGIN:VEVENT','UID:'+ev.id+'@jus9','DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').split('.')[0]+'Z','DTSTART:'+dt,'SUMMARY:'+escapeIcs(ev.titulo||'Evento Jus 9'),'DESCRIPTION:'+escapeIcs((ev.perfil||'')+' — '+(ev.descricao||'')),'END:VEVENT'); }); lines.push('END:VCALENDAR'); downloadBlob(new Blob([lines.join('\r\n')],{type:'text/calendar'}),'agenda-jus9.ics'); }
    window.limparAgendaLocal=function(){ if(confirm('Limpar agenda local deste navegador?')){ save([]); render(); }}
    render();
  }
  function escapeIcs(s){ return String(s||'').replace(/[,;]/g,'\\$&').replace(/\n/g,'\\n'); }
  function downloadBlob(blob,name){ const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(url),400); }
})();
