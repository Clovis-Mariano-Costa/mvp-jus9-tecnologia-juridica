
function selecionarPerfil(nome){ localStorage.setItem('perfilMVP', nome); location.href='app-painel.html'; }
console.log('MVP Jus 9 carregado.');

function jus9BindDemoPhotos(){
  document.querySelectorAll('[data-demo-photo-field]').forEach((field) => {
    const input = field.querySelector('[data-demo-photo-input]');
    const preview = field.querySelector('[data-demo-photo-preview]');
    const clear = field.querySelector('[data-demo-photo-clear]');
    if (!input || !preview) return;
    const original = preview.textContent || 'IMG';
    input.addEventListener('change', () => {
      const file = input.files && input.files[0];
      if (!file) return;
      if (!file.type || !file.type.startsWith('image/')) {
        input.value = '';
        alert('Use apenas imagem demonstrativa neste campo.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        preview.innerHTML = '';
        const img = document.createElement('img');
        img.src = event.target.result;
        img.alt = 'Previa da imagem demonstrativa';
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
    if (clear) {
      clear.addEventListener('click', () => {
        input.value = '';
        preview.innerHTML = original;
      });
    }
  });
}
document.addEventListener('DOMContentLoaded', jus9BindDemoPhotos);
