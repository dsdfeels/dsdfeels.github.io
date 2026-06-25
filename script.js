// Скрипт для Проекта DsDfeels 1.0

// 1. Плавный скролл для навигации (защита от багов)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// 2. Маленькая пасхалка: Приветствие в консоли (работодатели любят это видеть)
console.log("Привет, работодатель! 👋");
console.log("Это портфолио Солтана Александра. Сделано с нуля.");
console.log("Связь: dsdfeels@gmail.com");

// 3. Интерактив на будущее (заглушка)
console.log("Готов к новым проектам!");