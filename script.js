// 1. Переключение темы
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.getElementById('themeIcon');

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.className = 'fas fa-sun';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-moon';
    }
});

// 2. Активная ссылка в меню при скролле (ИСПРАВЛЕННАЯ ВЕРСИЯ)
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        // Сначала убираем активный класс у всех
        link.classList.remove('active');
        // Потом добавляем только тому, чья ссылка совпадает
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// 3. Анимация появления элементов при скролле
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.skill-card, .project-card').forEach(card => {
    card.classList.add('hidden');
    observer.observe(card);
});

document.querySelectorAll('.skill-card, .project-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease-out';
    observer.observe(card);
});

// 4. Обработка формы (заглушка)
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Спасибо за заявку! Я отвечу вам в ближайшее время.');
    this.reset();
});

// 5. Плавная прокрутка при клике на ссылки
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// --- ЦИТАТА НЕДЕЛИ ---
const quotes = [
    { text: "Код — это поэзия, которую понимает машина.", author: "Солтан Александр" },
    { text: "Если ты можешь это представить, ты можешь это запрограммировать.", author: "Солтан Александр" },
    { text: "Дисциплина — это мост между целью и достижением.", author: "Солтан Александр" },
    { text: "Веб-разработка — это искусство создавать возможности.", author: "Солтан Александр" },
    { text: "Я не тот, кем был вчера. Я тот, кем становлюсь сегодня.", author: "Солтан Александр" }
];

function changeQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selected = quotes[randomIndex];
    
    // Склеиваем строки старым добрым способом (без обратных кавычек)
    document.getElementById('weeklyQuote').textContent = '"' + selected.text + '"';
    document.getElementById('quoteAuthor').textContent = '- ' + selected.author;
}

// Автоматически показать случайную цитату при загрузке
window.addEventListener('load', () => {
    changeQuote();
});

// --- НОВЫЙ ПРОСТОЙ ПЛЕЕР ---
const audio = document.getElementById('weeklyMusic');
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const totalDurationEl = document.getElementById('totalDuration');

function playMusic() {
    audio.play();
    updateProgress();
}

function pauseMusic() {
    audio.pause();
}

audio.addEventListener('loadedmetadata', () => {
    totalDurationEl.textContent = formatTime(audio.duration);
});

function updateProgress() {
    setInterval(() => {
        if (audio.duration) {
            const percent = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = percent + '%';
            currentTimeEl.textContent = formatTime(audio.currentTime);
        }
    }, 200);
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
}