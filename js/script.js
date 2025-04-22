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
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource('https://stream.zeno.fm/hls/pcbduafehg0uv');
            hls.attachMedia(audio);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                audio.play();
            });
        } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
            audio.src = 'https://stream.zeno.fm/hls/pcbduafehg0uv';
            audio.addEventListener('loadedmetadata', function () {
                audio.play();
            });
        }
        playIcon.src = 'img/pause.png';
        isPlaying = true;
    } else {
        audio.pause();
        playIcon.src = 'img/play.png';
        isPlaying = false;
    }
});

document.getElementById("telegram-img").addEventListener("mouseover", function() {
    this.src = "img/Bot.png";
});

document.getElementById("telegram-img").addEventListener("mouseout", function() {
    this.src = "img/telegram.png";
});

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

    // Ограничиваем историю до 5 треков в массиве
    if (trackHistory.length > 4) {
        trackHistory.pop();
    }

    // Обновляем интерфейс для истории треков
    const historyContainer = document.querySelector('.history-list');
    historyContainer.innerHTML = ''; // Очищаем текущую историю

    // Показываем только треки с индекса 1 до 3 (игнорируем текущий трек, который находится на 0 индексе)
    const visibleHistory = trackHistory.slice(1, 4);

    visibleHistory.forEach(track => {
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');
        historyItem.innerHTML = `
            <img src="${track.artworkUrl}" alt="Album Art" class="history-thumbnail">
            <div class="history-info">${track.artist} - ${track.title}</div>
        `;
        historyContainer.appendChild(historyItem);
    });
}

function fetchAlbumCover(artist, title) {
    // Проверяем, является ли артист "RWR", если да - не выполняем запрос
    if (artist === 'RWR') {
        // Устанавливаем логотип по умолчанию
        updateAlbumCover('https://raw.githubusercontent.com/red-wine-radio/red-wine-radio.github.io/main/RWR600.jpg', artist, title);
        return;
    }

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

// Событие получения данных о треке
eventSource.addEventListener('message', function(event) {
    const data = JSON.parse(event.data);
    const streamTitle = data.streamTitle;

    // Разделяем название и исполнителя
    const [artist, title] = streamTitle.split(' - ');

    // Проверяем, является ли артист "RWR", если да - пропускаем этот трек
    if (artist === 'RWR' || artist === 'Offline') {
        console.log("Трек с артистом RWR или offline пропущен");
        return;
    }

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

if (window.Telegram && window.Telegram.WebApp && Telegram.WebApp.platform !== 'unknown') {
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
    document.body.classList.add('in-telegram');

    applyTelegramTheme();
    Telegram.WebApp.onEvent('themeChanged', applyTelegramTheme);
    
    const volumeControl = document.querySelector('.volume-control');
    if (volumeControl) {
      volumeControl.innerHTML = ''; // очистить содержимое
    }
}

function applyTelegramTheme() {
    const theme = Telegram.WebApp.colorScheme;
    document.body.classList.remove('dark-mode');

    if (theme === 'dark') {
    document.body.classList.add('dark-mode');
    }
}