// script.js

document.addEventListener('DOMContentLoaded', function() {
    // Находим форму
    const flightForm = document.getElementById('flightForm');
    const responseDiv = document.getElementById('responseMessage');

    // Устанавливаем минимальные даты для полей date (сегодня и завтра)
    const today = new Date().toISOString().split('T')[0];
    const departInput = document.getElementById('depart');
    const returnInput = document.getElementById('return');
    
    if (departInput) {
        departInput.min = today;
        // По умолчанию ставим завтрашний день
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        departInput.value = tomorrow.toISOString().split('T')[0];
    }
    if (returnInput) {
        returnInput.min = today;
        // По умолчанию через неделю
        let nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        returnInput.value = nextWeek.toISOString().split('T')[0];
    }

    // Обработка отправки формы через fetch (AJAX)
    if (flightForm) {
        flightForm.addEventListener('submit', function(e) {
            e.preventDefault(); // предотвращаем стандартную отправку

            // Собираем данные формы
            const formData = new FormData(flightForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Показываем сообщение о загрузке
            responseDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Обработка...';
            responseDiv.className = 'response-message';

            // Отправляем POST запрос на process.php
            fetch('process.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    responseDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${result.message}`;
                    responseDiv.className = 'response-message success';
                    // Можно добавить сброс формы или другие действия
                    flightForm.reset(); // очищаем форму (опционально)
                    // Восстанавливаем даты по умолчанию после сброса
                    if (departInput) departInput.value = tomorrow.toISOString().split('T')[0];
                    if (returnInput) returnInput.value = nextWeek.toISOString().split('T')[0];
                } else {
                    responseDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${result.message}`;
                    responseDiv.className = 'response-message error';
                }
            })
            .catch(error => {
                responseDiv.innerHTML = `<i class="fas fa-times-circle"></i> Ошибка соединения. Попробуйте позже.`;
                responseDiv.className = 'response-message error';
                console.error('Error:', error);
            });
        });
    }

    // Плавный скролл для якорей
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Небольшая дополнительная анимация: меняем цвет самолётика при скролле (просто для красоты)
    window.addEventListener('scroll', function() {
        const plane = document.querySelector('.plane-animation i');
        if (plane) {
            const opacity = 0.3 + window.scrollY / 1000;
            plane.style.color = `rgba(255, 107, 107, ${Math.min(opacity, 0.8)})`;
        }
    });
});
