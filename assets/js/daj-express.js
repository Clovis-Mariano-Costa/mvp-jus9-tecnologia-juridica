(function () {
  const form = document.getElementById("dajExpressForm");
  const preview = document.getElementById("dajPreview");
  const policy = document.getElementById("dajPolicy");
  const statusBadge = document.getElementById("dajStatusBadge");
  const storagePolicy = document.getElementById("dajStoragePolicy");
  const linkPublico = document.getElementById("dajCriarLinkPublico");
  const driveEndpoint = document.getElementById("dajDriveEndpoint");
  const driveToken = document.getElementById("dajDriveToken");
  const driveResult = document.getElementById("dajDriveResult");
  const storageKey = "jus9_daj_express_v1";

  const fields = {
    tipo: "dajTipo",
    prioridade: "dajPrioridade",
    classificacao: "dajClassificacao",
    referencia: "dajReferencia",
    local: "dajLocal",
    prazo: "dajPrazo",
    dataLimite: "dajDataLimite",
    revisor: "dajRevisor",
    fatos: "dajFatos",
    documentos: "dajDocumentos",
    objetivo: "dajObjetivo",
    confirmacaoDemo: "dajConfirmacaoDemo",
    confirmacaoRevisao: "dajConfirmacaoRevisao",
    criarLinkPublico: "dajCriarLinkPublico"
  };

  const rules = {
    PUBLICO: {
      badge: "publico",
      review: false,
      canCreatePublicLink: true,
      message: "PUBLICO permite link de download apenas quando o conteudo for educativo, ficticio ou aprovado."
    },
    INTERNO: {
      badge: "interno",
      review: false,
      canCreatePublicLink: false,
      message: "INTERNO pode ser salvo no Drive, mas sem link publico de download."
    },
    JURIDICO_SIGILOSO: {
      badge: "revisao",
      review: true,
      canCreatePublicLink: false,
      message: "JURIDICO_SIGILOSO entra em revisao humana e nao gera link publico."
    },
    COFRE_NAO_AUTOMATICO: {
      badge: "bloqueado",
      review: true,
      canCreatePublicLink: false,
      blocked: true,
      message: "COFRE_NAO_AUTOMATICO bloqueia automacao. Use decisao humana e fluxo proprio."
    }
  };

  function value(id) {
    const el = document.getElementById(id);
    if (!el) return "";
    if (el.type === "checkbox") return Boolean(el.checked);
    return String(el.value || "").trim();
  }

  function setValue(id, nextValue) {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.type === "checkbox") {
      el.checked = Boolean(nextValue);
      return;
    }
    el.value = nextValue || "";
  }

  function collect() {
    return Object.fromEntries(Object.entries(fields).map(([key, id]) => [key, value(id)]));
  }

  function currentRule(classificacao) {
    return rules[classificacao] || rules.JURIDICO_SIGILOSO;
  }

  function hasOperationalDeadline(data) {
    return Boolean(data.dataLimite || (data.prazo && data.prazo !== "Sem prazo real informado no MVP publico"));
  }

  function validationMessage(data) {
    if (!data.confirmacaoDemo || !data.confirmacaoRevisao) {
      return "Confirme o uso autorizado/ficticio e a revisao humana antes de gerar.";
    }
    if (!data.referencia || !data.fatos || !data.objetivo) {
      return "Preencha referência, fatos essenciais e próximo passo antes de gerar.";
    }
    if (data.prioridade === "URGENTE" && !hasOperationalDeadline(data)) {
      return "Para prioridade urgente, informe o risco/prazo ou uma data limite.";
    }
    return "";
  }

  function line(label, valueText) {
    return `- ${label}: ${valueText || "Nao informado"}`;
  }

  function buildMarkdown(data) {
    const rule = currentRule(data.classificacao);
    return [
      "# DAJ Express - MVP Advogados Jus 9",
      "",
      line("Tipo de atendimento", data.tipo),
      line("Prioridade operacional", data.prioridade),
      line("Classificacao", data.classificacao),
      line("Revisao humana obrigatoria", rule.review ? "SIM" : "NAO POR PADRAO"),
      line("Referencia", data.referencia),
      line("Cidade/UF", data.local),
      line("Prazo, risco ou urgencia", data.prazo),
      line("Data limite", data.dataLimite),
      line("Responsavel pela revisao", data.revisor),
      line("Link publico solicitado", data.criarLinkPublico && rule.canCreatePublicLink ? "SIM" : "NAO"),
      "",
      "## Fatos essenciais",
      data.fatos || "Nao informado.",
      "",
      "## Documentos recebidos ou pendentes",
      data.documentos || "Nao informado.",
      "",
      "## Pedido, objetivo ou proximo passo",
      data.objetivo || "Nao informado.",
      "",
      "## Checklist minimo",
      "- [ ] Confirmar autorizacao para uso dos dados.",
      "- [ ] Separar documentos publicos, internos, juridicos sigilosos e cofre.",
      "- [ ] Verificar prazo, audiencia ou risco imediato.",
      "- [ ] Identificar responsavel humano pela revisao.",
      "- [ ] Registrar decisao de salvar, baixar, arquivar ou encaminhar.",
      "",
      "## Governanca",
      rule.message,
      "Este DAJ e rascunho operacional. Nao representa parecer juridico, decisao final, promessa de resultado ou substituicao de profissional habilitado."
    ].join("\n");
  }

  function render() {
    const data = collect();
    const rule = currentRule(data.classificacao);
    if (linkPublico) {
      linkPublico.disabled = !rule.canCreatePublicLink;
      if (!rule.canCreatePublicLink) linkPublico.checked = false;
    }
    policy.textContent = validationMessage(data) || rule.message;
    statusBadge.textContent = rule.badge;
    preview.textContent = buildMarkdown(collect());
    persistDraft(data);
  }

  function canPersistDraft(data) {
    return ["PUBLICO", "INTERNO"].includes(data.classificacao);
  }

  function persistDraft(data) {
    if (canPersistDraft(data)) {
      localStorage.setItem(storageKey, JSON.stringify(data));
      if (storagePolicy) {
        storagePolicy.textContent = "Rascunho salvo apenas neste navegador; não use dados reais no MVP público.";
      }
      return;
    }

    localStorage.removeItem(storageKey);
    if (storagePolicy) {
      storagePolicy.textContent = "Privacidade: conteúdo jurídico sigiloso/cofre não é persistido neste navegador.";
    }
  }

  function download(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function slug(text) {
    return String(text || "daj-express")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase()
      .slice(0, 80) || "daj-express";
  }

  function filename(extension) {
    const data = collect();
    return `${slug(data.referencia || data.tipo)}-daj-express.${extension}`;
  }

  function restore() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
      if (!canPersistDraft(saved)) {
        localStorage.removeItem(storageKey);
        return;
      }
      Object.entries(fields).forEach(([key, id]) => {
        if (Object.prototype.hasOwnProperty.call(saved, key)) setValue(id, saved[key]);
      });
    } catch {
      // Sem acao: dados locais corrompidos nao devem travar o MVP.
    }
  }

  async function saveToDrive() {
    render();
    const data = collect();
    const rule = currentRule(data.classificacao);
    const endpoint = String(driveEndpoint.value || "").trim();
    const token = String(driveToken.value || "").trim();

    if (rule.blocked) {
      driveResult.textContent = "Bloqueado: COFRE_NAO_AUTOMATICO nao aceita salvamento automatico.";
      return;
    }
    if (!endpoint || !token) {
      driveResult.textContent = "Informe endpoint seguro e token temporario. A chave interna nunca deve ser digitada aqui.";
      return;
    }

    driveResult.textContent = "Enviando para o backend seguro...";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          titulo: `DAJ Express - ${data.referencia || data.tipo}`,
          conteudo: buildMarkdown(data),
          classificacao: data.classificacao,
          tipoDocumento: "DAJ_EXPRESS_MVP_ADVOGADOS",
          origem: "MVP Advogados / DAJ Express",
          autorOperacional: "Charlie Echo da Costa / Jus 9",
          observacao: "Gerado no MVP Advogados. Revisao humana antes de uso real.",
          criarLinkDownload: Boolean(data.criarLinkPublico && rule.canCreatePublicLink)
        })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok === false) {
        throw new Error(result.error || result.mensagem || "Falha ao salvar no backend.");
      }

      const links = [
        result.url || result.viewUrl ? `Visualizacao: ${result.viewUrl || result.url}` : "",
        result.downloadUrl ? `Download: ${result.downloadUrl}` : ""
      ].filter(Boolean);

      driveResult.textContent = [
        "Documento salvo com governanca.",
        `Classificacao: ${result.classificacaoFinal || data.classificacao}`,
        `Destino: ${result.pastaDestino || "nao informado"}`,
        links.length ? links.join("\n") : "Sem link publico retornado."
      ].join("\n");
      driveToken.value = "";
    } catch (error) {
      driveResult.textContent = `Nao foi possivel salvar: ${error.message}`;
    }
  }

  if (!form) return;

  restore();
  render();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = collect();
    if (validationMessage(data)) {
      return;
    }
    render();
  });

  form.addEventListener("input", render);
  form.addEventListener("change", render);

  document.querySelectorAll("[data-daj-download]").forEach((button) => {
    button.addEventListener("click", () => {
      render();
      const format = button.getAttribute("data-daj-download");
      const data = collect();
      if (validationMessage(data)) {
        policy.textContent = validationMessage(data);
        return;
      }
      if (format === "json") {
        download(filename("json"), JSON.stringify({ ...data, conteudo: buildMarkdown(data) }, null, 2), "application/json;charset=utf-8");
        return;
      }
      download(filename("md"), buildMarkdown(data), "text/markdown;charset=utf-8");
    });
  });

  document.getElementById("dajCopyButton")?.addEventListener("click", async () => {
    render();
    const data = collect();
    if (validationMessage(data)) {
      policy.textContent = validationMessage(data);
      return;
    }
    const text = preview.textContent || "";
    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch {
      copied = false;
    }
    if (!copied) {
      const helper = document.createElement("textarea");
      helper.value = text;
      helper.setAttribute("readonly", "");
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      try { copied = document.execCommand("copy"); } catch { copied = false; }
      helper.remove();
    }
    policy.textContent = copied ? "DAJ copiado para a área de transferência." : "Não foi possível copiar automaticamente; use os botões de download.";
  });

  document.getElementById("dajClearButton")?.addEventListener("click", () => {
    if (!confirm("Limpar o rascunho local deste navegador?")) return;
    localStorage.removeItem(storageKey);
    location.reload();
  });

  document.getElementById("dajDriveSaveButton")?.addEventListener("click", saveToDrive);
})();
