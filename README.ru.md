# Библиотека BEM Core

`bem-core` — это библиотека с открытым кодом, которая предоставляет набор блоков для разработки веб-интерфейсов. Содержит необходимый минимум для разработки клиентского JS и HTML-шаблонов.

[![CI](https://github.com/bem/bem-core/actions/workflows/ci.yml/badge.svg?branch=v5)](https://github.com/bem/bem-core/actions/workflows/ci.yml) [![GitHub Release](https://img.shields.io/github/release/bem/bem-core.svg)](https://github.com/bem/bem-core/releases)

> **Примечание.** Информация о библиотеке в более информативном виде доступна на [bem.info](https://ru.bem.info/libs/bem-core/). This README is also available [in English](https://en.bem.info/libs/bem-core/).

## Содержание

* [Уровни](#Уровни-переопределения)
* [Блоки](#Блоки)
* [Использование](#Использование)
* [Поддерживаемые браузеры](#Поддерживаемые-браузеры)
* [Технологии](#Технологии)
* [API](#api)
* [Разработка](#Разработка)

**Дополнительная информация**

* [История изменений](CHANGELOG.ru.md)
* [Миграция на последующие версии](MIGRATION.ru.md)

## Уровни переопределения

* `common.blocks` — поддержка всех устройств и браузеров;
* `desktop.blocks` — поддержка всех десктопных браузеров;
* `touch.blocks` — реализация специфических особенностей для touch-платформ.

## Блоки

* [i-bem](common.blocks/i-bem/i-bem.ru.md) — базовый блок с хелперами для JS и HTML;
* [i-bem-dom](common.blocks/i-bem-dom/i-bem-dom.ru.md) — базовый блок с хелперами для HTML;
* [strings](common.blocks/strings/strings.ru.md) — хелперы для JS-строк;
* [objects](common.blocks/objects/objects.ru.md) — хелперы для JS-объектов;
* [functions](common.blocks/functions/functions.ru.md) — хелперы для JS-функций;
* [events](common.blocks/events/events.ru.md) — JS-события;
* [uri](common.blocks/uri/uri.ru.md) — работа с URI и строкой запроса;
* [tick](common.blocks/tick/tick.ru.md) — глобальный таймер;
* [idle](common.blocks/idle/idle.ru.md) — IDLE-событие;
* [next-tick](common.blocks/next-tick/next-tick.ru.md) — полифил для `nextTick`/`setTimeout(0, ...)`;
* [inherit](common.blocks/inherit/inherit.ru.md) — ООП-хелперы;
* [jquery](common.blocks/jquery/jquery.ru.md) — jQuery;
* [clearfix](common.blocks/clearfix/clearfix.ru.md) — CSS-трюк clearfix;
* [identify](common.blocks/identify/identify.ru.md) — идентификация JS-объектов;
* [cookie](common.blocks/cookie/cookie.ru.md) — хелперы для работы с браузерными куками;
* [dom](common.blocks/dom/dom.ru.md) — хелперы для работы с DOM;
* [loader](common.blocks/loader/loader.ru.md) — загрузчик для JS-файлов;
* [ua](common.blocks/ua/ua.ru.md) — определение возможностей браузера;
* [uri](common.blocks/uri/uri.ru.md) — декодирование строки из формата URI;
* [keyboard](common.blocks/keyboard/keyboard.ru.md) — хелперы для работы с клавиатурой;
* [page](common.blocks/page/page.ru.md) — скелет для html/head/body.

## Использование

Установите как npm-зависимость:

```shell
npm install bem-core@5
```

jQuery 4 — peer-зависимость, установите рядом:

```shell
npm install jquery@^4.0.0
```

## Поддерживаемые браузеры

* Google Chrome (последняя версия)
* Firefox (последняя версия)
* Safari (последняя версия)
* Edge (последняя версия)

## Технологии

* vanilla.js + browser.js;
* DEPS;
* bemhtml;
* bemtree.

## API

Автосгенерированную документацию на JavaScript API блоков (JSDoc) можно посмотреть на bem.info. Например, для блока `i-bem` она доступна по ссылке https://ru.bem.info/platform/libs/bem-core/current/desktop/i-bem/#jsdoc

## Разработка

### Рабочая копия

1. Получаем исходники:

   ```bash
   git clone -b v5 git://github.com/bem/bem-core.git
   cd bem-core
   ```

2. Устанавливаем зависимости (требуется Node.js 20+):

   ```bash
   npm install
   ```

3. Запускаем линтер:

   ```bash
   npm run lint
   ```

4. Запускаем тесты:

   ```bash
   npm test              # серверные тесты (node:test)
   npm run test:browser  # браузерные тесты (Playwright)
   npm run test:all      # все тесты
   ```

5. Собираем:

   ```bash
   npm run build         # desktop + touch платформы
   ```

## Команда основной разработки

* [veged](https://github.com/veged)
* [dfilatov](https://github.com/dfilatov)
* [tadatuta](https://github.com/tadatuta)

## Лицензия

© 2012 YANDEX LLC. Код лицензирован [Mozilla Public License 2.0](LICENSE.txt).
