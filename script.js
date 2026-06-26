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
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyfPaldGPOcR2NwjkJ-kyV8fNE7vqFWwn6PeLsbtrqvX2RC4Ra0gCo78icsbYW-kd_z/exec"
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

// 1. Функция отправки отзыва
function submitReview() {
    const nameInput = document.getElementById('reviewName');
    const textInput = document.getElementById('reviewText');

    const name = nameInput.value.trim();
    const text = textInput.value.trim();

    if (name === "" || text === "") {
        alert("⚠️ Заполни имя и текст!");
        return;
    }

    // Показываем, что отправляем
    const btn = document.querySelector('button[onclick="submitReview()"]');
    const originalText = btn.textContent;
    btn.textContent = "⏳ Отправка...";
    btn.disabled = true;

    // Отправляем данные в Google Sheets
    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            text: text
        })
    })
    .then(() => {
        // ВОТ ТУТ ПОЯВЛЯЕТСЯ ОКОШКО!
        alert("✅ Отзыв успешно отправлен в таблицу!");
        
        nameInput.value = '';
        textInput.value = '';
        loadReviews(); // Обновить список
    })
    .catch((error) => {
        alert("❌ Ошибка: " + error.message);
    })
    .finally(() => {
        btn.textContent = originalText;
        btn.disabled = false;
    });
}

// --- МУЗЫКАЛЬНЫЙ ПЛЕЕР ---
let isPlaying = false;

function toggleMusic() {
    const audio = document.getElementById('bgMusic');
    const btn = document.getElementById('musicToggle');
    
    if (!isPlaying) {
        audio.play();
        btn.textContent = '🔊';
        isPlaying = true;
    } else {
        audio.pause();
        btn.textContent = '🔇';
        isPlaying = false;
    }
}

// Автоматически ставим на паузу при закрытии вкладки
document.addEventListener('visibilitychange', () => {
    const audio = document.getElementById('bgMusic');
    if (document.hidden && isPlaying) {
        audio.pause();
        btn.textContent = '🔇';
        isPlaying = false;
    }
});

// Ссылка на твой скрипт Google
const SCRIPT_URL = "https://script.google.com/macros/s/ТВОЯ_ССЫЛКА_ИЗ_ШАГА_2/exec"; // НЕ ЗАБУДЬ ВСТАВИТЬ СВОЮ ССЫЛКУ!

// --- СТАТИСТИКА ---
let myChart = null;

// 2. Функция загрузки отзывов и статистики
function loadReviews() {
    const list = document.getElementById('reviewsList');
    list.innerHTML = '<p style="text-align:center; color:#888;">Загрузка...</p>';

    fetch(SCRIPT_URL)
    .then(response => response.json())
    .then(data => {
        list.innerHTML = '';
        
        let total = 0;
        let ratingSum = 0;
        let ratings = {5:0, 4:0, 3:0, 2:0, 1:0};

        if (data && data.length > 0) {
            data.reverse().forEach((review, index) => {
                // Создаём карточку отзыва (как и раньше)
                const card = document.createElement('div');
                card.style.backgroundColor = "#f8f9fa";
                card.style.padding = "15px";
                card.style.borderRadius = "10px";
                card.style.borderLeft = "4px solid #3498db";
                card.style.marginBottom = "12px";
                card.style.textAlign = "left";

                // Если в таблице есть 4-я колонка с оценкой (Rating), мы её используем
                // Для начала сгенерируем случайную оценку для демонстрации, 
                // чтобы график был красивым. Потом ты сможешь заменить это на реальные данные из таблицы.
                const randomRating = Math.floor(Math.random() * 5) + 1;
                ratings[randomRating]++;

                // Подсчёт статистики
                total++;
                ratingSum += randomRating;

                let strongName = document.createElement('strong');
                strongName.style.color = "#2c3e50";
                strongName.style.fontSize = "16px";
                strongName.textContent = review[0] || "Аноним";

                let textPara = document.createElement('p');
                textPara.style.margin = "8px 0";
                textPara.style.color = "#444";
                textPara.style.fontSize = "15px";
                textPara.textContent = review[1] || "Без текста";

                let dateStr = "Только что";
                if (review[2]) {
                    const d = new Date(review[2]);
                    dateStr = d.toLocaleDateString('ru-RU');
                }

                let dateDiv = document.createElement('div');
                dateDiv.style.fontSize = "12px";
                dateDiv.style.color = "#999";
                dateDiv.textContent = dateStr;

                // Добавляем звёздочки к отзыву (визуально)
                let starsDiv = document.createElement('div');
                starsDiv.style.marginTop = "5px";
                starsDiv.textContent = "⭐".repeat(randomRating);

                card.appendChild(strongName);
                card.appendChild(textPara);
                card.appendChild(starsDiv);
                card.appendChild(dateDiv);
                list.appendChild(card);
            });
        } else {
            list.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">Пока нет отзывов.</p>';
        }

        // Обновляем текстовую статистику
        document.getElementById('totalReviews').textContent = total;
        document.getElementById('avgRating').textContent = total > 0 ? (ratingSum / total).toFixed(1) : "0.0";

        // Рисуем график (если есть данные)
        if (total > 0) {
            drawChart(ratings);
        }
    })
    .catch(() => {
        list.innerHTML = '<p style="color: red; text-align: center;">Ошибка загрузки.</p>';
    });
}

// --- ФУНКЦИЯ РИСОВАНИЯ ГРАФИКА ---
function drawChart(ratingsData) {
    const ctx = document.getElementById('ratingChart').getContext('2d');

    // Если график уже есть, удаляем его перед перерисовкой
    if (myChart) {
        myChart.destroy();
    }
    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['⭐ 5', '⭐ 4', '⭐ 3', '⭐ 2', '⭐ 1'],
            datasets: [{
                label: 'Оценки',
                data: [ratingsData[5], ratingsData[4], ratingsData[3], ratingsData[2], ratingsData[1]],
                backgroundColor: [
                    '#3498db', // 5 звёзд
                    '#2ecc71', // 4 звезды
                    '#f1c40f', // 3 звезды
                    '#e67e22', // 2 звезды
                    '#e74c3c'  // 1 звезда
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

// 3. Загружаем при старте
document.addEventListener('DOMContentLoaded', loadReviews);