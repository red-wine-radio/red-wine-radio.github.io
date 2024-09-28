// Инициализация аудио плеера
const audio = document.getElementById('audio');
const playButton = document.getElementById('play-btn');
const playIcon = document.getElementById('play-icon');
const trackTime = document.getElementById('trackTime');
const songInfo = document.getElementById('song-info');
const albumCover = document.querySelector('.logo-overlay');

// История треков (до 5 треков)
let trackHistory = [];

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

// Функция для обновления истории треков
function updateTrackHistory(artist, title, artworkUrl) {
    // Проверяем, есть ли трек уже в истории
    const isDuplicate = trackHistory.some(track => track.artist === artist && track.title === title);

    // Если трек уже есть, выходим из функции
    if (isDuplicate) {
        return;
    }

    // Добавляем трек в начало истории
    trackHistory.unshift({ artist, title, artworkUrl });

    // Ограничиваем историю до 5 треков
    if (trackHistory.length > 5) {
        trackHistory.pop();
    }

    // Обновляем интерфейс для истории треков
    const historyContainer = document.querySelector('.history-list');
    historyContainer.innerHTML = ''; // Очищаем текущую историю

    trackHistory.forEach(track => {
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        historyItem.innerHTML = `
            <img src="${track.artworkUrl}" alt="Album Art" class="history-thumbnail">
            <div class="history-info">${track.artist} - ${track.title}</div>
        `;
        historyContainer.appendChild(historyItem);
    });
}

// Функция для запроса обложки через API Deezer с повторной попыткой
function fetchAlbumCover(artist, title) {
    const deezerApiUrl = `https://api.deezer.com/search?q=${encodeURIComponent(artist)} ${encodeURIComponent(title)}&output=jsonp&callback=handleDeezerResponse`;

    // Первый запрос
    const script = document.createElement('script');
    script.src = deezerApiUrl;
    document.body.appendChild(script);

    // Ручка для обработки ответа
    window.handleDeezerResponse = function (data) {
        if (data.data && data.data.length > 0) {
            const artworkUrl = data.data[0].album.cover_big;
            updateAlbumCover(artworkUrl, artist, title);
        } else {
            // Если первая попытка не удалась, повторяем через 5 секунд
            setTimeout(() => {
                updateAlbumCover('https://raw.githubusercontent.com/red-wine-radio/red-wine-radio.github.io/main/RWR600.jpg', artist, title);
            }, 5000);
        }
    };
}

// Функция для обновления обложки альбома
function updateAlbumCover(artworkUrl, artist, title) {
    albumCover.src = artworkUrl;
    updateTrackHistory(artist, title, artworkUrl); // Обновляем историю с обложкой
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

        // Запрос обложки через API Deezer
        fetchAlbumCover(artist, title);

        // Сбрасываем и запускаем таймер отсчета времени с момента обновления трека в интерфейсе
        startTrackTimeUpdate();

    }, 10000); // Задержка в 10 секунд
});

eventSource.addEventListener('ping', function() {
    console.log('Ping received');
});