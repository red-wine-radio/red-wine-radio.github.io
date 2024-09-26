<!DOCTYPE html>
<html lang="en-US">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Red Wine Radio: Listen Online</title>
    <link rel="icon" type="image/png" href="https://raw.githubusercontent.com/red-wine-radio/red-wine-radio.github.io/main/RWR600.jpg" />

    <style>
        body {
            background-color: #C91EB5;
            color: #FFFFFF;
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
        }

        .player-container {
            max-width: 600px;
            margin: 0 auto;
        }

        .player-logo img {
            width: 200px;
            border-radius: 10px;
        }
    </style>
</head>

<body>

    <div class="player-container">
        <h1>Red Wine Radio</h1>
        <div class="player-logo">
            <img src="https://raw.githubusercontent.com/red-wine-radio/red-wine-radio.github.io/main/RWR600.jpg" alt="Red Wine Radio Logo">
        </div>
        <div id="p1"></div> <!-- Контейнер для плеера -->
    </div>

    <!-- Подключаем скрипт плеера -->
    <script src="https://radiowink.com/dist/freeV3.js"></script>
    <script>
        var p1 = new freeYess({
            target: '#p1',
            url: 'https://stream.zeno.fm/pcbduafehg0uv',
            platform: 'ic',
            mountPoint: 'stream',
            logo: 'https://raw.githubusercontent.com/red-wine-radio/red-wine-radio.github.io/main/RWR600.jpg',
            artistc: 'BDC0F8',
            songtitlec: 'FFFFFF',
            buttonc: 'FFFFFF',
            bg: 'C91EB5',
            artwork: '1',
            autoplay: 'false',
        });
    </script>

</body>

</html>
