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

// --- СИСТЕМА ОТЗЫВОВ (РЕАЛЬНАЯ БАЗА ДАННЫХ FIREBASE) ---

// --- СИСТЕМА ОТЗЫВОВ (НА БРАУЗЕРЕ) ---

// 1. Загружаем отзывы при открытии
function loadReviews() {
    const list = document.getElementById('reviewsList');
    list.innerHTML = ''; // Очищаем

    // Получаем данные из памяти браузера
    const stored = localStorage.getItem('dsdfeels_reviews');
    let reviews = [];
    
    if (stored) {
        try {
            reviews = JSON.parse(stored);
        } catch (e) {
            reviews = [];
        }
    }

    if (reviews.length > 0) {
        // Переворачиваем (новые сверху)
        reviews.reverse().forEach(review => {
            const card = document.createElement('div');
            
            // Стили
            card.style.backgroundColor = "#f8f9fa";
            card.style.padding = "15px";
            card.style.borderRadius = "10px";
            card.style.borderLeft = "4px solid #3498db";
            card.style.marginBottom = "12px";
            card.style.textAlign = "left";

            // Элементы
            let strongName = document.createElement('strong');
            strongName.style.color = "#2c3e50";
            strongName.style.fontSize = "16px";
            strongName.textContent = review.name;

            let textPara = document.createElement('p');
            textPara.style.margin = "8px 0";
            textPara.style.color = "#444";
            textPara.style.fontSize = "15px";
            textPara.textContent = review.text;

            let dateDiv = document.createElement('div');
            dateDiv.style.fontSize = "12px";
            dateDiv.style.color = "#999";
            dateDiv.textContent = review.date || "Только что";

            // Собираем
            card.appendChild(strongName);
            card.appendChild(textPara);
            card.appendChild(dateDiv);
            
            list.appendChild(card);
        });
    } else {
        list.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">Пока нет отзывов. Будь первым! ✍️</p>';
    }
}

// 2. Функция отправки
function submitReview() {
    const nameInput = document.getElementById('reviewName');
    const textInput = document.getElementById('reviewText');

    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    if (name === "" || text === "") {
        alert("⚠️ Заполни имя и текст!");
        return;
    }

    // Создаём объект отзыва
    const newReview = {
        name: name,
        text: text,
        date: new Date().toLocaleDateString('ru-RU')
    };

    // Сохраняем в браузер
    let reviews = [];
    const stored = localStorage.getItem('dsdfeels_reviews');
    if (stored) {
        try {
            reviews = JSON.parse(stored);
        } catch (e) {
            reviews = [];
        }
    }
    
    reviews.push(newReview);
    localStorage.setItem('dsdfeels_reviews', JSON.stringify(reviews));

    // Очищаем поля
    nameInput.value = '';
    textInput.value = '';

    alert("✅ Отзыв сохранён!");
    
    // Перезагружаем список без перезагрузки страницы
    loadReviews();
}

// 3. Загружаем при старте
document.addEventListener('DOMContentLoaded', loadReviews);