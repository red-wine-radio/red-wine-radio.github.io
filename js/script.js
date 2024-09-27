// Инициализация аудио плеера
const audio = document.getElementById('audio');
const playButton = document.getElementById('play-btn');
const playIcon = document.getElementById('play-icon');
const trackTime = document.getElementById('trackTime');

// Переменная для отслеживания состояния плеера
let isPlaying = false;

// Функция переключения состояния плеера
playButton.addEventListener('click', () => {
    if (!isPlaying) {
        audio.play();
        playIcon.src = 'img/pause.png'; // Меняем изображение на "Pause"
        isPlaying = true;
    } else {
        audio.pause();
        playIcon.src = 'img/play.png'; // Меняем изображение на "Play"
        isPlaying = false;
    }
});

// Обновление времени трека
audio.addEventListener('timeupdate', () => {
    const minutes = Math.floor(audio.currentTime / 60);
    const seconds = Math.floor(audio.currentTime % 60);
    trackTime.textContent = `Time ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
});

// Инициализация ползунка noUiSlider
const volumeSlider = document.getElementById('volume-slider');
noUiSlider.create(volumeSlider, {
    start: [80], // Начальная громкость (80%)
    range: {
        'min': 0,
        'max': 100
    },
    step: 1,
    connect: [true, false]
});

// Обновление громкости при изменении ползунка
volumeSlider.noUiSlider.on('update', (values) => {
    audio.volume = values[0] / 100; // Преобразуем значение ползунка в диапазон 0-1
});