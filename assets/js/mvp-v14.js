const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => [...document.querySelectorAll(selector)];

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function load(key, fallback = null) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch (error) {
    return fallback;
  }
}

function go(path) {
  location.href = path;
}

function initLogin() {
  const form = qs("#loginForm");
  if (!form) return;

  form.onsubmit = (event) => {
    event.preventDefault();
    const user = {
      nome: qs("#usuario").value,
      email: qs("#email").value || "",
      cadastrado: load("jus9_usuario_cadastrado", false),
    };
    save("jus9_usuario", user);
    go("selecionar-perfil.html");
  };
}

function initPerfis() {
  qsa("[data-perfil]").forEach((button) => {
    button.onclick = () => {
      save("jus9_perfil", button.dataset.perfil);
      if (load("jus9_usuario_cadastrado", false)) {
        go(button.dataset.destino);
      } else {
        go("cadastro-usuario.html");
      }
    };
  });
}

function initCadastro() {
  const form = qs("#cadastroForm");
  if (!form) return;

  const perfil = load("jus9_perfil", "professor");
  const perfilLabel = qs("#perfilCadastro");
  if (perfilLabel) perfilLabel.textContent = perfil;

  form.onsubmit = (event) => {
    event.preventDefault();
    save("jus9_usuario_cadastrado", true);
    const usuario = load("jus9_usuario", {});
    usuario.cadastroLider = true;
    usuario.perfil = perfil;
    save("jus9_usuario", usuario);
    go(`perfis/${perfil}.html`);
  };
}

function agendaAdd() {
  const evento = {
    titulo: qs("#eventoTitulo").value,
    data: qs("#eventoData").value,
    tipo: qs("#eventoTipo").value,
    perfil: load("jus9_perfil", "geral"),
  };
  const agenda = load("agenda_jus9", []);
  agenda.push(evento);
  save("agenda_jus9", agenda);
  renderAgenda();
}

function renderAgenda() {
  const lista = qs("#agendaLista");
  if (!lista) return;

  const agenda = load("agenda_jus9", []);
  lista.innerHTML = agenda
    .map((evento) => `<li><b>${evento.data}</b> - ${evento.titulo} (${evento.tipo}/${evento.perfil})</li>`)
    .join("") || "<li>Nenhum evento cadastrado.</li>";
}

function exportJSON() {
  const anchor = document.createElement("a");
  anchor.href = URL.createObjectURL(
    new Blob([JSON.stringify(load("agenda_jus9", []), null, 2)], { type: "application/json" }),
  );
  anchor.download = "agenda-jus9.json";
  anchor.click();
}

function exportICS() {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Jus9//Agenda//PT-BR"];
  load("agenda_jus9", []).forEach((evento, index) => {
    const data = (evento.data || "2026-01-01").replaceAll("-", "");
    lines.push(
      "BEGIN:VEVENT",
      `UID:jus9-${index}@jus9tecnologia.com.br`,
      `DTSTAMP:${data}T120000Z`,
      `DTSTART;VALUE=DATE:${data}`,
      `SUMMARY:${evento.titulo}`,
      `DESCRIPTION:${evento.tipo} - ${evento.perfil}`,
      "END:VEVENT",
    );
  });
  lines.push("END:VCALENDAR");

  const anchor = document.createElement("a");
  anchor.href = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/calendar" }));
  anchor.download = "agenda-jus9.ics";
  anchor.click();
}

function initDemoPhotos() {
  qsa("[data-demo-photo-field]").forEach((field) => {
    const input = field.querySelector("[data-demo-photo-input]");
    const preview = field.querySelector("[data-demo-photo-preview]");
    const clear = field.querySelector("[data-demo-photo-clear]");
    if (!input || !preview) return;
    const original = preview.textContent || "IMG";
    input.addEventListener("change", () => {
      const file = input.files && input.files[0];
      if (!file) return;
      if (!file.type || !file.type.startsWith("image/")) {
        input.value = "";
        alert("Use apenas imagem demonstrativa neste campo.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        preview.innerHTML = "";
        const img = document.createElement("img");
        img.src = event.target.result;
        img.alt = "Previa da imagem demonstrativa";
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
    if (clear) {
      clear.addEventListener("click", () => {
        input.value = "";
        preview.innerHTML = original;
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initLogin();
  initPerfis();
  initCadastro();
  initDemoPhotos();
  renderAgenda();
});
