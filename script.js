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

// --- ПОДКЛЮЧЕНИЕ К БАЗЕ ДАННЫХ ---
// (Переменные database и reviewsRef мы объявили в index.html, поэтому здесь они уже доступны)

// --- СИСТЕМА ОТЗЫВОВ ---

// 1. Функция отправки отзыва в Firebase
function submitReview() {
    // Получаем значения из полей ввода
    const nameInput = document.getElementById('reviewName');
    const textInput = document.getElementById('reviewText');

    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    // Проверка на пустые поля
    if (name === "" || text === "") {
        alert("⚠️ Пожалуйста, заполните имя и текст отзыва!");
        return;
    }

    // Отправляем данные в базу данных Firebase
    reviewsRef.push({
        name: name,
        text: text,
        timestamp: Date.now()
    })
    .then(() => {
        // Если всё успешно — очищаем поля и радуемся
        nameInput.value = '';
        textInput.value = '';
        alert("✅ Спасибо! Отзыв сохранён в облачной базе данных!");
    })
    .catch((error) => {
        alert("❌ Ошибка при сохранении: " + error.message);
    });
}

// 2. Функция загрузки отзывов (она сработает сама при открытии страницы)
function loadReviews() {
    const list = document.getElementById('reviewsList');
    
    // Слушаем изменения в базе данных
    reviewsRef.on('value', (snapshot) => {
        const data = snapshot.val();
        list.innerHTML = ''; // Очищаем список перед загрузкой

        if (data) {
            // Превращаем объект в массив и переворачиваем (чтобы новые были сверху)
            const reviewsArray = Object.values(data).reverse();
            
            reviewsArray.forEach(review => {
                // Создаём карточку отзыва
                const card = document.createElement('div');
                card.style.cssText = 
                    background: #f8f9fa; 
                    padding: 15px; 
                    border-radius: 10px; 
                    border-left: 4px solid #3498db; 
                    margin-bottom: 12px;
                    text-align: left;
                ;
                
                // Форматируем дату
                let dateStr = "Только что";
                if (review.timestamp) {
                    const date = new Date(review.timestamp);
                    dateStr = date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
                }

                card.innerHTML = 
                    <strong style="color: #2c3e50; font-size: 16px;">${review.name}</strong>
                    <p style="margin: 8px 0; color: #444; font-size: 15px;">${review.text}</p>
                    <div style="font-size: 12px; color: #999;">${dateStr}</div>
                ;
                
                list.appendChild(card);
            });
        } else {
            list.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">Пока нет отзывов. Будь первым! ✍️</p>';
        }
    });
}

// 3. Запускаем загрузку отзывов, как только страница загрузится
document.addEventListener('DOMContentLoaded', loadReviews);