<p align="center">
  <img src="img/logo.svg" alt="Клуб четырех коней" height="56">
</p>

<h1 align="center">Клуб четырех коней</h1>

<p align="center">
  Лендинг Международного васюкинского турнира по&nbsp;шахматам<br>
  <em>по мотивам романа Ильфа и&nbsp;Петрова «Двенадцать стульев»</em>
</p>

<p align="center">
  <a href="https://joyful-marshmallow-fed806.netlify.app/"><strong>Открыть сайт →</strong></a>
  &nbsp;·&nbsp;
  <a href="https://joyful-marshmallow-fed806.netlify.app/">Netlify</a>
</p>

<p align="center">
  <img src="https://api.microlink.io/?url=https%3A%2F%2Fjoyful-marshmallow-fed806.netlify.app&screenshot=true&meta=false&embed=screenshot.url&viewport.width=1440&viewport.height=900" alt="Превью сайта" width="720">
</p>

---

## О проекте

Одностраничный лендинг: от hero с призывом оплатить взнос на телеграммы — до этапов преображения Васюков и карусели участников турнира. Pixel Perfect desktop / mobile, без фреймворков и сборки.

## Стек

| | |
| --- | --- |
| Разметка | HTML5 |
| Стили | CSS3 (custom properties, flex/grid) |
| Логика | Vanilla JS |
| Шрифты | [Merriweather](https://fonts.google.com/specimen/Merriweather), [Golos Text](https://fonts.google.com/specimen/Golos+Text) |
| Хостинг | [Netlify](https://joyful-marshmallow-fed806.netlify.app/) |

## Что внутри

- **Hero** — full-bleed фон, CTA-якоря, бегущая строка с цитатами
- **Event** — лекция «Плодотворная дебютная идея» и сеанс О. Бендера
- **Roadmap** — 7 этапов; на mobile — слайдер без loop и autoplay
- **Participants** — бесконечная карусель, автосмена каждые 4 с
- **Motion** — reveal при скролле, hover кнопок, float самолёта

## Структура

```
├── index.html
├── css/
│   ├── reset.css
│   └── style.css
├── js/
│   └── script.js
├── img/
└── fav/
```

## Запуск

Откройте `index.html` в браузере или из корня проекта:

```bash
npx serve .
# или
python -m http.server 5500
```

## Live

**[joyful-marshmallow-fed806.netlify.app](https://joyful-marshmallow-fed806.netlify.app/)**
