// Инициализация аудио плеера
const audio = document.getElementById('audio');
const playButton = document.getElementById('play-btn');
const playIcon = document.getElementById('play-icon');
const trackTime = document.getElementById('trackTime');
const songInfo = document.getElementById('song-info');
const albumCover = document.querySelector('.logo-overlay'); // Элемент для обложки

// Переменная для отслеживания состояния плеера и времени трека
let isPlaying = false;
let timeUpdateInterval;
let secondsSinceUpdate = 0;

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

// Функция обновления времени с момента обновления интерфейса трека
function updateTrackTimeSinceChange() {
    const minutes = Math.floor(secondsSinceUpdate / 60);
    const seconds = Math.floor(secondsSinceUpdate % 60);
    trackTime.textContent = `Time ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    secondsSinceUpdate++; // Увеличиваем количество секунд с момента обновления интерфейса
}

// Функция сброса времени и перезапуска отсчета
function startTrackTimeUpdate() {
    secondsSinceUpdate = 0; // Сброс секунд до нуля
    clearInterval(timeUpdateInterval); // Остановка предыдущего таймера (если был)
    timeUpdateInterval = setInterval(updateTrackTimeSinceChange, 1000); // Запуск обновления каждую секунду
}

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

const eventSource = new EventSource('https://api.zeno.fm/mounts/metadata/subscribe/pcbduafehg0uv');

eventSource.addEventListener('message', function(event) {
    const data = JSON.parse(event.data);
    const streamTitle = data.streamTitle;

    // Разделяем название и исполнителя
    const [artist, title] = streamTitle.split(' - ');

    // Добавляем задержку в 10 секунд перед обновлением информации о треке
    setTimeout(() => {
        // Обновляем информацию о треке в интерфейсе
        songInfo.textContent = `${artist} - ${title}`;
        
        // Сбрасываем и запускаем таймер отсчета времени с момента обновления трека в интерфейсе
        startTrackTimeUpdate();

        // Получение и обновление обложки трека
        updateAlbumCover(artist, title);

    }, 10000); // Задержка в 10 секунд
});

eventSource.addEventListener('ping', function() {
    console.log('Ping received');
});

// Функция для обновления обложки трека
function updateAlbumCover(artist, title) {
    // Создаем запрос к Deezer API для получения обложки
    const deezerApiUrl = `https://api.deezer.com/search?q=${encodeURIComponent(artist)} ${encodeURIComponent(title)}&output=jsonp&callback=handleDeezerResponse`;

    const script = document.createElement('script');
    script.src = deezerApiUrl;
    document.body.appendChild(script);
}

// Обработка ответа от Deezer API
function handleDeezerResponse(data) {
    if (data.data && data.data.length > 0) {
        // Получаем URL обложки альбома
        const artworkUrl = data.data[0].album.cover_big;
        
        // Если обложка найдена, обновляем изображение в плеере
        albumCover.src = artworkUrl;
    } else {
        // Если обложка не найдена, возвращаем логотип и запускаем повторную попытку через 5 секунд
        albumCover.src = 'https://raw.githubusercontent.com/red-wine-radio/red-wine-radio.github.io/main/RWR600.jpg';
        
        // Запускаем повторную попытку через 5 секунд
        setTimeout(() => {
            console.log("Повторная попытка загрузки обложки...");
            loadCoverArt(currentArtist, currentTitle); // Повторная попытка загрузки обложки
        }, 5000);
    }
}