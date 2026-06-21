(function () {
  const form = document.querySelector("#autorEditorForm");
  const output = document.querySelector("#autorEditorReport");
  const downloadButton = document.querySelector("[data-download-editorial]");
  let currentReport = "";

  function value(name) {
    const field = form?.elements?.[name];
    return (field?.value || "").trim();
  }

  function buildReport() {
    const now = new Date().toISOString();
    const titulo = value("titulo") || "Obra sem titulo";
    const autor = value("autor") || "Autor nao informado";
    const categoria = value("categoria") || "Categoria nao informada";
    const estagio = value("estagio") || "Estagio nao informado";
    const paginas = value("paginas") || "nao informado";
    const amostra = value("amostra") || "8.594";
    const sinopse = value("sinopse") || "Sinopse publica ainda nao informada.";
    const pendencias = value("pendencias") || "Pendencias a definir em revisao humana.";

    return [
      "# Relatorio editorial preliminar - MVP Autor/Editor",
      "",
      `Gerado em: ${now}`,
      "Classificacao: PUBLICO / DEMONSTRATIVO / SEM DADOS REAIS",
      "",
      "## Identificacao",
      `- Titulo: ${titulo}`,
      `- Autor(a) / equipe: ${autor}`,
      `- Categoria: ${categoria}`,
      `- Estagio: ${estagio}`,
      `- Paginas estimadas: ${paginas}`,
      `- Amostra publica sugerida: ${amostra}%`,
      "",
      "## Sinopse segura",
      sinopse,
      "",
      "## Pendencias editoriais",
      pendencias,
      "",
      "## Checklist de revisao humana",
      "- Confirmar autoria e titularidade.",
      "- Confirmar permissao de uso de imagens, citacoes, marcas e anexos.",
      "- Verificar se ha dados pessoais, dados sensiveis ou trechos sigilosos.",
      "- Definir amostra publica e limites de divulgacao.",
      "- Separar parecer editorial de contrato, licenca, ISBN e publicacao.",
      "- Registrar decisao humana antes de publicar qualquer material real.",
      "",
      "## Conduta da Charlie Echo",
      "Responder com organizacao editorial, cautela e proximo passo. Nao prometer publicacao, ISBN, venda, contrato ou parecer juridico final.",
      ""
    ].join("\n");
  }

  function downloadReport() {
    if (!currentReport) return;
    const blob = new Blob([currentReport], { type: "text/markdown;charset=utf-8" });
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = "relatorio-editorial-preliminar-jus9.md";
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  }

  if (form && output) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      currentReport = buildReport();
      output.textContent = currentReport;
      localStorage.setItem("jus9_autor_editor_relatorio", currentReport);
      if (downloadButton) downloadButton.disabled = false;
      output.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    form.addEventListener("reset", () => {
      currentReport = "";
      output.textContent = "Preencha o formulario para gerar o relatorio local.";
      if (downloadButton) downloadButton.disabled = true;
    });
  }

  if (downloadButton) {
    downloadButton.addEventListener("click", downloadReport);
  }
})();
