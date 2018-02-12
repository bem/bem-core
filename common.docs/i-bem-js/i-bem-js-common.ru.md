## Знакомьтесь: i-bem.js

* [Введение в компонентный подход](#Введение-в-компонентный-подход)
* [Настройка страницы](#Настройка-страницы)
* [Модульная система i-bem.js](#Модульная-система-i-bemjs)
* [Простой компонент](#Простой-компонент)

### Введение в компонентный подход



### Настройка страницы

Фреймворк `i-bem.js` входит в состав библиотеки [bem-core](https://ru.bem.info/platform/libs/bem-core/). Чтобы работать с `i-bem.js` в браузере, нужно подключить библиотеку на страницу. В примере ниже показано, как добавляется сценарий на страницу из Yаndex CDN.

```diff index.html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Подключение i-bem.js</title>
</head>
<body class="page">

    <!-- Библиотека bem-core -->
+   <script src="https://yastatic.net/bem-core/latest/desktop/bem-core.no-autoinit.js"></script>
    <script>
        // Код i-bem.js и JavaScript
    </script>

</body>
</html>
```

Это минимальные требования для работы с `i-bem.js` в браузере. Можно поместить ваш код JavaScript в отдельный файл, но он должен загружаться на страницу уже после загрузки `bem-core`.

### Модульная система i-bem.js

Реализация `i-bem.js` состоит из двух модулей:

* **Модуль i-bem**.

  Предоставляет базовую реализацию JS-блока `i-bem`, от которой наследуются все блоки и элементы в `i-bem.js`. Блок `i-bem` написан с расчетом на использование в любом JS-окружении: как на клиенте, так и на сервере (например, в Node.js).

* **Модуль i-bem-dom**.

  Предоставляет базовую реализацию блока и элемента, привязанных к DOM-узлу. Рассчитан на использование на клиенте, опирается на работу браузеров с DOM. Зависит от `jQuery`.

Зависимости:

* jQuery (только для модуля `i-bem-dom`). При использовании `bem-core` отдельная установка jQuery не требуется.
* Модульная система [ym/modules](https://github.com/ymaps/modules). При использовании [ENB](https://ru.bem.info/toolbox/enb/) с технологией `.browser.js` (и производных от нее) эта зависимость удовлетворяется автоматически.

Можно использовать `i-bem.js` как часть полного стека БЭМ-инструментов. В этом случае свой проект удобно создавать на основе шаблонного репозитория [project-stub](https://ru.bem.info/platform/project-stub/), в котором настроена автоматическая установка зависимых библиотек и сборка.

Если не планируется использование других технологий БЭМ-платформы, достаточно поместить код библиотеки `bem-core` в существующий проект.

### Простой компонент

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Простой компонент</title>
</head>
<body class="page i-bem" data-bem='{ "page": {} }'>

    <!-- Библиотека bem-core -->
    <script src="https://yastatic.net/bem-core/latest/desktop/bem-core.no-autoinit.js"></script>
    <script>
    modules.define('page', ['i-bem-dom'], function(provide, bemDom){
        provide(bemDom.declBlock(this.name, {
            onSetMod: {
                js: {
                    inited: function() {
                        bemDom.prepend(this.domElem, '<h1 class="heading">Hello, world!</h1>');
                    }
                }
            },

        }));
    });
    // Инициализация
    modules.require('i-bem-dom__init', function(init) { init(); });
    </script>

</body>
</html>
```
