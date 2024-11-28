// Função que corrige o link de x.com para twitter.com
function corrigirLink(link) {
    return link
    .replace("https://x.com/", "https://twitter.com/")
    .replace("https://www.youtube.com/shorts/", "https://www.youtube.com/watch?v=")

  }
  
  // Monitorar todos os inputs de texto na página
  document.addEventListener("input", (event) => {
    const target = event.target;
  
    // Verificar se o elemento é um campo de input ou textarea
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
      // Substituir o texto digitado ou colado
      const novoTexto = corrigirLink(target.value);
      if (novoTexto !== target.value) {
        target.value = novoTexto;
      }
    }
  });
  
  // Adicionar um listener para eventos de "paste" (caso o usuário cole um link)
  document.addEventListener("paste", (event) => {
    const target = event.target;
  
    // Verificar se o elemento é um campo de input ou textarea
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
      const textoColado = (event.clipboardData || window.clipboardData).getData("text");
      const novoTexto = corrigirLink(textoColado);
      
      if (novoTexto !== textoColado) {
        event.preventDefault(); // Evitar o texto colado original
        target.value = novoTexto; // Substituir pelo texto corrigido
      }
    }
  });
  