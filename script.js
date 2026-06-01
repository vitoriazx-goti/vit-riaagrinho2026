// ===========================
// AGROVIDA — script.js
// Agricultura Sustentável
// ===========================

// ===========================
// 1. NAVBAR — efeito de scroll + menu mobile
// ===========================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
});

// Fechar menu ao clicar num link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.textContent = '☰';
  });
});

// ===========================
// 2. ANIMAÇÃO DE APARECIMENTO DOS CARDS
// ===========================
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.card, .pilar, .beneficio').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// ===========================
// 3. CONTADOR ANIMADO (ESTATÍSTICAS)
// ===========================
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);

  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start);
    }
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      nums.forEach(num => {
        const target = parseInt(num.getAttribute('data-target'));
        animateCounter(num, target);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObserver.observe(statsBar);

// ===========================
// 4. QUIZ INTERATIVO
// ===========================
const perguntas = [
  {
    pergunta: "O que é rotação de culturas?",
    opcoes: [
      "Girar o trator em círculos no campo",
      "Alternar diferentes culturas em uma mesma área ao longo do tempo",
      "Regar as plantas em horários alternados",
      "Usar fertilizantes químicos em excesso"
    ],
    correta: 1,
    explicacao: "✅ Correto! Rotação de culturas consiste em alternar as espécies cultivadas numa área para proteger o solo e quebrar ciclos de pragas."
  },
  {
    pergunta: "Qual técnica de irrigação é considerada a mais eficiente?",
    opcoes: [
      "Aspersão convencional",
      "Irrigação por inundação",
      "Gotejamento",
      "Mangueira comum"
    ],
    correta: 2,
    explicacao: "✅ Correto! O gotejamento entrega água diretamente nas raízes, reduzindo o desperdício em até 50%."
  },
  {
    pergunta: "O que são agroflorestas?",
    opcoes: [
      "Fazendas de madeira para desmatamento controlado",
      "Sistemas que integram árvores, animais e cultivos numa mesma área",
      "Plantações de flores para exportação",
      "Armazéns de grãos modernos"
    ],
    correta: 1,
    explicacao: "✅ Correto! Agroflorestas imitam a floresta natural, combinando diversas espécies para aumentar a produtividade sustentável."
  },
  {
    pergunta: "Por que é importante evitar o uso excessivo de agrotóxicos?",
    opcoes: [
      "Porque eles são muito caros",
      "Porque os insetos gostam do cheiro",
      "Porque poluem o solo, a água e podem prejudicar a saúde humana",
      "Porque deixam os alimentos mais coloridos"
    ],
    correta: 2,
    explicacao: "✅ Correto! O uso excessivo contamina rios, mata abelhas e outros polinizadores, e pode acumular-se nos alimentos."
  },
  {
    pergunta: "Qual é um exemplo de energia renovável usada na agricultura sustentável?",
    opcoes: [
      "Carvão mineral",
      "Diesel",
      "Energia solar",
      "Energia nuclear"
    ],
    correta: 2,
    explicacao: "✅ Correto! Painéis solares são cada vez mais usados no campo para abastecer bombas d'água e equipamentos, reduzindo emissões de CO₂."
  }
];

let questaoAtual = 0;
let pontuacao = 0;

const quizQuestion = document.getElementById('quiz-question');
const quizOptions = document.getElementById('quiz-options');
const quizFeedback = document.getElementById('quiz-feedback');
const quizNext = document.getElementById('quiz-next');
const quizBar = document.getElementById('quiz-bar');
const quizBox = document.getElementById('quiz-box');
const quizResult = document.getElementById('quiz-result');
const quizQuestionNum = document.getElementById('quiz-question-num');
const resultEmoji = document.getElementById('result-emoji');
const resultMsg = document.getElementById('result-msg');
const resultScore = document.getElementById('result-score');
const quizRestart = document.getElementById('quiz-restart');

function carregarQuestao() {
  const q = perguntas[questaoAtual];
  quizQuestion.textContent = q.pergunta;
  quizFeedback.textContent = '';
  quizNext.style.display = 'none';
  quizQuestionNum.textContent = `Pergunta ${questaoAtual + 1} de ${perguntas.length}`;
  quizBar.style.width = `${((questaoAtual) / perguntas.length) * 100}%`;

  quizOptions.innerHTML = '';
  q.opcoes.forEach((opcao, index) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = opcao;
    btn.addEventListener('click', () => verificarResposta(btn, index));
    quizOptions.appendChild(btn);
  });
}

function verificarResposta(btnClicado, index) {
  const q = perguntas[questaoAtual];

  // Desabilitar todos
  quizOptions.querySelectorAll('.quiz-option').forEach(btn => {
    btn.disabled = true;
  });

  if (index === q.correta) {
    btnClicado.classList.add('correct');
    quizFeedback.textContent = q.explicacao;
    quizFeedback.style.color = '#2d6a35';
    pontuacao++;
  } else {
    btnClicado.classList.add('wrong');
    quizOptions.querySelectorAll('.quiz-option')[q.correta].classList.add('correct');
    quizFeedback.textContent = '❌ Não foi desta vez! ' + q.explicacao.replace('✅ Correto! ', '');
    quizFeedback.style.color = '#dc2626';
  }

  quizNext.style.display = 'block';
}

quizNext.addEventListener('click', () => {
  questaoAtual++;

  if (questaoAtual < perguntas.length) {
    carregarQuestao();
  } else {
    mostrarResultado();
  }
});

function mostrarResultado() {
  quizBar.style.width = '100%';
  quizBox.style.display = 'none';
  quizResult.style.display = 'block';

  const pct = (pontuacao / perguntas.length) * 100;

  if (pct === 100) {
    resultEmoji.textContent = '🏆';
    resultMsg.textContent = 'Incrível! Você é um expert!';
  } else if (pct >= 60) {
    resultEmoji.textContent = '🌱';
    resultMsg.textContent = 'Muito bem! Continue aprendendo!';
  } else {
    resultEmoji.textContent = '📚';
    resultMsg.textContent = 'Continue estudando, você vai chegar lá!';
  }

  resultScore.textContent = `Você acertou ${pontuacao} de ${perguntas.length} questões (${Math.round(pct)}%)`;
}

quizRestart.addEventListener('click', () => {
  questaoAtual = 0;
  pontuacao = 0;
  quizResult.style.display = 'none';
  quizBox.style.display = 'block';
  carregarQuestao();
});

// Iniciar quiz
carregarQuestao();
