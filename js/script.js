// Получаем элементы
const playButton = document.getElementById('play-btn');
const playIcon = document.getElementById('play-icon');
const audio = document.getElementById('audio-player');
let isPlaying = false;

// Добавляем обработчик клика для кнопки
playButton.addEventListener('click', () => {
    if (!isPlaying) {
        audio.play();  // Воспроизвести поток
        playIcon.src = 'img/pause.png';  // Меняем изображение на "пауза"
        isPlaying = true;
    } else {
        audio.pause();  // Остановить поток
        playIcon.src = 'img/play.png';  // Меняем изображение обратно на "play"
        isPlaying = false;
    }
});

// Обновляем время трека
audio.addEventListener('timeupdate', () => {
    const minutes = Math.floor(audio.currentTime / 60);
    const seconds = Math.floor(audio.currentTime % 60);
    trackTime.textContent = `Time ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
});