# Библиотека BEM Core

`bem-core` — это библиотека с открытым кодом, которая предоставляет набор блоков для разработки веб-интерфейсов. Содержит необходимый минимум для разработки клиентского JS и HTML-шаблонов.

[![Build Status](https://travis-ci.org/bem/bem-core.svg?branch=v2)](https://travis-ci.org/bem/bem-core) [![GitHub Release](https://img.shields.io/github/release/bem/bem-core.svg)](https://github.com/bem/bem-core/releases) [![devDependency Status](https://david-dm.org/bem/bem-core/dev-status.svg)](https://david-dm.org/bem/bem-core#info=devDependencies)

> **Примечание.** Информация о библиотеке в более информативном виде доступна на [bem.info](https://ru.bem.info/libs/bem-core/). This README is also available [in English](https://en.bem.info/libs/bem-core/).

## Содержание

* [Уровни](#Уровни-переопределения)
* [Блоки](#Блоки)
* [Использование](#Использование)
* [Поддерживаемые браузеры](#Поддерживаемые-браузеры)
* [Технологии](#Технологии)
* [API](#api)
* [Разработка](#Разработка)
* [Команда основной разработки](#Команда-основной-разработки)
* [Рабочий процесс](#Рабочий-процесс)

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
* [querystring](common.blocks/querystring/querystring.ru.md) — работа со строкой запроса;
* [tick](common.blocks/tick/tick.ru.md) — глобальный таймер;
* [idle](common.blocks/idle/idle.ru.md) — IDLE-событие;
* [next-tick](common.blocks/next-tick/next-tick.ru.md) — полифил для `nextTick`/`setTimeout(0, ...)`;
* [inherit](common.blocks/inherit/inherit.ru.md) — ООП-хелперы;
* [jquery](common.blocks/jquery/jquery.ru.md) — jQuery;
* [clearfix](common.blocks/clearfix/clearfix.ru.md) — CSS-трюк clearfix;
* [identify](common.blocks/identify/identify.ru.md) — идентификация JS-объектов;
* [cookie](common.blocks/cookie/cookie.ru.md) — хелперы для работы с браузерными куками;
* [vow](common.blocks/vow/vow.ru.md) — реализация Promises/A+;
* [dom](common.blocks/dom/dom.ru.md) — хелперы для работы с DOM;
* [loader](common.blocks/loader/loader.ru.md) — загрузчик для JS-файлов;
* [ua](common.blocks/ua/ua.ru.md) — определение возможностей браузера;
* [uri](common.blocks/uri/uri.ru.md) — декодирование строки из формата URI;
* [keyboard](common.blocks/keyboard/keyboard.ru.md) — хелперы для работы с клавиатурой;
* [page](common.blocks/page/page.ru.md) — скелет для html/head/body.

## Использование

Наиболее простым способом начать проект с использованием `bem-core` является
[project-stub](https://github.com/bem/project-stub).

## Поддерживаемые браузеры

Мы поддерживаем браузеры на основе статистики, получаемой на сервисах [Яндекса](https://company.yandex.ru).

Браузеры с долей:

* более 2% пользователей — полная совместимость.
* более 0.5% — частичная совместимость (означает, что данные будут доступны, но возможна деградация).
* менее 0.5% — не поддерживаются.

**Desktop**

*Полная совместимость*

* Google Chrome 29+;
* Firefox 24+;
* Yandex 1.7+;
* Opera 12.16;
* MSIE 10.0;
* MSIE 9.0;
* MSIE 8.0;
* Opera 12.15.

*Частичная совместимость*

* Opera 17.0;
* Opera 16.0;
* Opera 12.14;
* Opera 12.2;
* Firefox 23.

**Touch**

*Полная совместимость*

* iOS 6+;
* Android 2.3+;
* Opera Mobile 12+;
* Windows Phone 7+.

*Частичная совместимость*

* iOS 5;
* Android 2.2.

## Технологии

* vanilla.js + browser.js;
* DEPS;
* bemhtml;
* bemtree.

## API

Автосгенерированную документацию на JavaScript API блоков (JSDoc) можно посмотреть на bem.info. Например, для блока `i-bem` она доступна по ссылке https://ru.bem.info/platform/libs/bem-core/current/desktop/i-bem/#jsdoc

## Разработка

* [Рабочая копия](#Рабочая-копия)
* [Модульное тестирование](#Модульное-тестирование)
  * [Покрытие кода тестами](#Покрытие-кода-тестами)

### Рабочая копия

1. Получаем исходники нужной версии (например, `v4`):

   ```bash
   $ git clone -b v4 git://github.com/bem/bem-core.git
   $ cd bem-core
   ```

2. Устанавливаем зависимости:

   ```bash
   $ npm install
   ```
   Для последующего запуска локально установленных npm-зависимостей нам потребуется `export PATH=./node_modules/.bin:$PATH` или любой альтернативный способ.

3. Устанавливаем зависимые библиотеки:

   ```bash
   $ npm run deps
   ```

4. Собираем примеры и тесты:

   ```bash
   $ npm test
   ```

5. Запускаем разработческий сервер:

   ```bash
   $ npm start
   ```

### Модульное тестирование

Сборка дефолтного тестового бандла для `functions__debounce`:

```bash
$ magic make desktop.specs/functions__debounce
```

После сборки тестового бандла вы увидите результаты выполнения тестов в консоли. Их также можно посмотреть в браузере, открыв `desktop.specs/functions__debounce/spec-js+browser-js+bemhtml/spec-js+browser-js+bemhtml.html`.

По аналогии можно запустить тесты для других БЭМ-сущностей, имеющих реализацию в технологии `spec.js`.

#### Покрытие кода тестами

Чтобы собрать статистику покрытия кода тестами, необходимо добавить переменную окружения `ISTANBUL_COVERAGE=yes` в сборке тестового бандла:

```bash
$ ISTANBUL_COVERAGE=yes magic make desktop.specs && istanbul report html
```

Сбор статистики покрытия тестами так же работает для запуска тестов конкретной БЭМ-сущности.

Пример для `functions__debounce`:

```bash
$ ISTANBUL_COVERAGE=yes magic make desktop.specs/functions__debounce && istanbul report html
```

После завершения выполнения тестов, можно посмотреть отчет о покрытии кода тестами, открыв в браузере страницу `coverage/index.html`.

Полный отчет и статистику покрытия кода библиотеки тестами можно посмотреть на [странице профиля bem-core](https://coveralls.io/r/bem/bem-core) в проекте [Coveralls](https://coveralls.io).

Для сборки и запуска тестов используется библиотека [enb-bem-specs](https://github.com/enb-bem/enb-bem-specs/). См. [подробную информацию](https://ru.bem.info/tools/bem/enb-bem-specs/) про инфраструктуру тестирования.

## Команда основной разработки

* [veged](https://github.com/veged)
* [dfilatov](https://github.com/dfilatov)
* [tadatuta](https://github.com/tadatuta)

## Рабочий процесс

Список текущих задач отображается на специальном [Agile Board](https://waffle.io/bem/bem-core).

Статусы задач:

* **backlog** — неразобранные задачи, которые требуют обсуждения командой для оценки и принятия решения о реализации. В таком статусе также могут находиться задачи, по которым нужна дополнительная информация.
* **ready** — разобранные задачи, решение о реализации которых принято.
* **in progress** — задачи с конкретным исполнителем, которые находятся в работе.
* **done** — задачи, закрытые за последние семь дней (это временное техническое ограничение выбранного Agile Board).

## Лицензия

© 2012 YANDEX LLC. Код лицензирован [Mozilla Public License 2.0](LICENSE.txt).
