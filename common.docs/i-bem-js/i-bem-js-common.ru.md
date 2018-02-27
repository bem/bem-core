## Знакомьтесь: i-bem.js

* [Введение в компонентный подход](#Введение-в-компонентный-подход)
* [Виртуальная DOM](#Виртуальная-dom)
* [Подключение i-bem.js](#Подключение-i-bemjs)
* [Модульная система i-bem.js](#Модульная-система-i-bemjs)
* [Простой компонент](#Простой-компонент)
* [Несколько компонентов](#Несколько-компонентов)

### Введение в компонентный подход

Компонент — это независимая часть пользовательского интерфейса с определенной:

* структурой;
* внешним видом;
* логикой работы.

В БЭМ такие компоненты принято называть [блоками](https://ru.bem.info/methodology/key-concepts/#Блок). Очень важно, чтобы компоненты были переиспользуемыми и расширяемыми.

**Пример**

![page](https://rawgit.com/bem/bem-core/godfreyd-i-bem-js/common.docs/i-bem-js/i-bem-js-common__page.svg)

### Виртуальная DOM

HTML — это набор инструкций, на основе которых браузер строит древовидную структуру DOM. Когда браузер загружает код HTML, его элементы становятся элементами DOM.

HTML-элементы связаны друг с другом в иерархии: существуют родительские и дочерние элементы. Последнии, в свою очередь, могут быть родительскими для других элементов.

С появлением Ajax добавление новых HTML-элементов на страницу с небольшими порциями данных стало обычным делом. Изначально браузер загружает один HTML-документ. В ходе взаимодействия пользователя со страницей, JavaScript выполняет работу по разбору DOM и добавлению новых элементов интерфейса.

Управление изменениями DOM с помощью JavaScript может стать очень сложным и затратным по времени. Часто такое управление выполняется императивно:

```js
const h1 = document.createElement("h1");
h1.innerHTML = 'Hello, world!';
document.body.appendChild(h1);
```

`i-bem.js` помогает работать с DOM декларативно и не думать о том, как найти тот или иной элемент. Все HTML-элементы объявленные в `i-bem.js` имеют свой JavaScript объект с набором инструкций, применяемых для построения пользовательского интерфейса и взаимодействия с браузером. Таким образом, разработчик изменяет виртуальную модель DOM, а `i-bem.js` отображает эти изменения наиболее эффективным образом.

### Подключение i-bem.js

Фреймворк `i-bem.js` входит в состав библиотеки [bem-core](https://ru.bem.info/platform/libs/bem-core/). Самый простой способ подключить библиотеку на страницу — загрузить сценарий из Yаndex CDN.

```diff index.html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Подключение i-bem.js</title>
</head>
<!-- Блок page -->
<body class="page">

    <!-- Библиотека bem-core -->
+   <script src="https://yastatic.net/bem-core/latest/desktop/bem-core.no-autoinit.js"></script>
    <script>
        // Код i-bem.js и JavaScript
    </script>

</body>
</html>
```

Это минимальные требования для работы с `i-bem.js` в браузере. Можно поместить ваш код JavaScript в отдельный файл, но он должен загружаться на страницу после загрузки `bem-core`.

### Модульная система i-bem.js

`i-bem.js` использует модульную систему [ym/modules](https://github.com/ymaps/modules), которая позволяет:

* Предоставлять модули асинхронно (`provide`).
* Подключать модули асинхронно (`require`).
* Переопределять и доопределять модули.

Основным модулем в `i-bem.js` является `i-bem-dom` — JavaScript реализация DOM. Модуль рассчитан на использование на клиенте.

Для декларации блока в модуле `i-bem-dom`, необходимо вызвать метод `bemDom.declBlock()`:

```js
modules.define('page', ['i-bem-dom'], function(provide, bemDom){
   // Создаем JavaScript-экземпляр блока page в модуле i-bem-dom
  provide(bemDom.declBlock(this.name, {

  }));
});
```

> **Примечание.** Зависит от библиотеки [jQuery](https://jquery.com), поэтому отдельная установка не требуется. Все методы jQuery доступны по умолчанию.

### Простой компонент

Чтобы создать компонент в `i-bem.js`, необходимо:

* создать JavaScript-экземпляр блока;
* связать HTML-элемент с JavaScript-экземпляром.

**Пример**

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Простой компонент</title>
</head>
<!-- Привязка HTML-элемента к JavaScript-экземпляру блока page -->
<body class="page i-bem" data-bem='{ "page": {} }'>

    <!-- Библиотека bem-core -->
    <script src="https://yastatic.net/bem-core/latest/desktop/bem-core.no-autoinit.js"></script>
    <script>
    // Cоздание модуля ym, содержащий JavaScript-реализацию блока page
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

[Открыть в JSFiddle](https://jsfiddle.net/godfreyd/ejqo2xyz/)

### Несколько компонентов

Чтобы создать несколько компонентов в `i-bem.js`, необходимо повторить все действия, выполненные в [предыдущем разделе](#Простой-компонент), с каждым из блоков.

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Несколько компонентов</title>
</head>
<!-- Привязка HTML-элемента к JavaScript-экземпляру блока page -->
<body class="page i-bem" data-bem='{ "page": {} }'>
    <!-- Привязка HTML-элемента к JavaScript-экземпляру блока user -->
    <div class="user i-bem" data-bem='{ "user": {} }'></div>

    <!-- Библиотека bem-core -->
    <script src="https://yastatic.net/bem-core/latest/desktop/bem-core.no-autoinit.js"></script>
    <script>
    // Cоздание модуля ym, содержащий JavaScript-реализацию блока page
    modules.define('page', ['i-bem-dom'], function(provide, bemDom){
        provide(bemDom.declBlock(this.name, {
            onSetMod: {
                js: {
                    inited: function() {
                        bemDom.prepend(this.domElem, '<h1 class="heading">Hello, world!</h1>');
                    }
                }
            }
        }));
    });
    // Cоздание модуля ym, содержащий JavaScript-реализацию блока user
    modules.define('user', ['i-bem-dom'], function(provide, bemDom){
        provide(bemDom.declBlock(this.name, {
            onSetMod: {
                js: {
                    inited: function() {
                        const user = 'Ben Reilly';
                        bemDom.prepend(this.domElem, '<h2 class="heading">Hello, '+ user +'!</h2>');
                    }
                }
            }
        }));
    });
    // Инициализация
    modules.require('i-bem-dom__init', function(init) { init(); });
    </script>

</body>
</html>
```

[Открыть в JSFiddle](https://jsfiddle.net/godfreyd/kmum6t4q/)

JavaScript-реализацию каждого блока можно вынести в отдельные файлы:

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Несколько компонентов</title>
</head>
<!-- Блок page -->
<body class="page i-bem" data-bem='{ "page": {} }'>
    <!-- Блок user -->
    <div class="user i-bem" data-bem='{ "user": {} }'></div>

    <!-- Библиотека bem-core -->
    <script src="https://yastatic.net/bem-core/latest/desktop/bem-core.no-autoinit.js"></script>
    <script src="page.js"></script>
    <script src="user.js"></script>
    <script>
    // Инициализация
    modules.require('i-bem-dom__init', function(init) { init(); });
    </script>

</body>
</html>
```

Часто все JavaScript-реализации блоков [собирают в отдельный бандл](https://ru.bem.info/methodology/build/), который затем подключают на страницу. Тема сборки выходят за рамки этого документа, поэтому вы можете использовать готовые шаблонные репозитории, где сборка бандлов настроена по умолчанию:

* [project-stub](https://github.com/bem/project-stub) — для статических проектов;
* [bem-express](https://github.com/bem/bem-express) — для динамических проектов.
