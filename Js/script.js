// ===========================
// MENU MOBILE (HAMBÚRGUER)
// ===========================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('ativo');
  navMenu.classList.toggle('ativo');
});

document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('ativo');
    navMenu.classList.remove('ativo');
  });
});

// ===========================
// NAVBAR — SOMBRA AO ROLAR
// ===========================
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===========================
// FORMULÁRIO → WHATSAPP (Aprimorado com Validação)
// ===========================
document.getElementById('formContato').addEventListener('submit', function (e) {
  e.preventDefault();

  const nome     = document.getElementById('nome').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const crianca  = document.getElementById('crianca').value.trim();
  const motivo   = document.getElementById('motivo').value;
  const mensagem = document.getElementById('mensagem').value.trim();

  if (!nome || !telefone || !crianca || !motivo) {
    alert("Por favor, preencha todos os campos obrigatórios corretamente antes de enviar.");
    return;
  }

  const texto = `Olá, Dra. Carol! Vim pelo site e gostaria de agendar uma consulta.

👤 *Responsável:* ${nome}
📞 *Telefone:* ${telefone}
👶 *Criança:* ${crianca}
🩺 *Motivo:* ${motivo}
💬 *Mensagem:* ${mensagem || 'Nenhuma mensagem adicional'}`;

  window.open(`https://wa.me/5518996386459?text=${encodeURIComponent(texto)}`, '_blank');
});

// ===========================
// SCROLL REVEAL GERAL
// ===========================
const observador = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visivel');
      
      setTimeout(() => {
        entry.target.style.transitionDelay = '0s';
      }, 600);
    }
  });
}, { threshold: 0.15 });

const sobreImagem = document.querySelector('.sobre-imagem');
const sobreTexto  = document.querySelector('.sobre-texto');
if (sobreImagem) sobreImagem.classList.add('reveal-left');
if (sobreTexto)  sobreTexto.classList.add('reveal-right');

document.querySelectorAll('.servico-card').forEach(card => {
  card.classList.add('reveal');
  observador.observe(card);
});

document.querySelectorAll('.contato-wpp, .contato-form').forEach(el => {
  el.classList.add('reveal');
  observador.observe(el);
});

document.querySelectorAll(
  '.reveal, .reveal-left, .reveal-right, .sobre-badge, .numero-item, .avaliacoes-carousel, .avaliacoes-cta, .hero-badge'
).forEach(el => observador.observe(el));

// ===========================
// CONTADOR ANIMADO
// ===========================
const contadorObservador = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'));
      const duracao = 1800;
      const inicio = performance.now();

      const animar = (agora) => {
        const progresso = Math.min((agora - inicio) / duracao, 1);
        const easeOut = 1 - Math.pow(1 - progresso, 3);
        el.textContent = Math.floor(easeOut * target);
        if (progresso < 1) requestAnimationFrame(animar);
        else el.textContent = target;
      };

      requestAnimationFrame(animar);
      contadorObservador.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.numero-valor').forEach(el => {
  contadorObservador.observe(el);
});

// ===========================
// EFEITO 3D NOS CARDS (Corrigido)
// ===========================
document.querySelectorAll('.servico-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect    = card.getBoundingClientRect();
    const x       = e.clientX - rect.left;
    const y       = e.clientY - rect.top;
    const cx      = rect.width  / 2;
    const cy      = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -8;
    const rotateY = ((x - cx) / cx) * 8;

    card.style.transition = 'none';
    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.5s ease, box-shadow 0.3s ease';
    card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// ===========================
// CARROSSEL DE AVALIAÇÕES
// ===========================
const track = document.querySelector('.carousel-track');
if(track) {
  const slides = Array.from(track.children);
  const nextButton = document.querySelector('.carousel-btn.next');
  const prevButton = document.querySelector('.carousel-btn.prev');

  let slideWidth = slides[0].getBoundingClientRect().width + 24; // 24px é o 'gap' configurado no CSS
  let currentIndex = 0;

  // Atualiza a largura caso o utilizador redimensione a janela
  window.addEventListener('resize', () => {
    slideWidth = slides[0].getBoundingClientRect().width + 24;
    currentIndex = 0;
    track.style.transform = `translateX(0px)`;
  });

  const moveToSlide = (track, index) => {
    track.style.transform = `translateX(-${slideWidth * index}px)`;
  };

  const getVisibleSlides = () => window.innerWidth <= 768 ? 1 : 3;

  nextButton.addEventListener('click', () => {
    const maxIndex = slides.length - getVisibleSlides();
    if (currentIndex >= maxIndex) {
      currentIndex = 0; // Volta para o começo
    } else {
      currentIndex++;
    }
    moveToSlide(track, currentIndex);
  });

  prevButton.addEventListener('click', () => {
    const maxIndex = slides.length - getVisibleSlides();
    if (currentIndex <= 0) {
      currentIndex = maxIndex; // Vai para o final
    } else {
      currentIndex--;
    }
    moveToSlide(track, currentIndex);
  });

  // Auto-play (Desliza sozinho)
  let autoPlayInterval = setInterval(() => { nextButton.click(); }, 4000);

  // Pausa o carrossel se o rato estiver em cima para o utilizador poder ler
  const carouselContainer = document.querySelector('.avaliacoes-carousel');
  carouselContainer.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
  carouselContainer.addEventListener('mouseleave', () => {
    autoPlayInterval = setInterval(() => { nextButton.click(); }, 4000);
  });
}

// ===========================
// FAQ — ACCORDION
// ===========================
document.querySelectorAll('.faq-pergunta').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const estaAberto = item.classList.contains('ativo');

    // Fecha todos
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('ativo'));

    // Abre o clicado (se estava fechado)
    if (!estaAberto) item.classList.add('ativo');
  });
});

// Reveal nas novas seções
document.querySelectorAll('.step, .faq-item').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${i * 0.08}s`;
  observador.observe(el);
});
