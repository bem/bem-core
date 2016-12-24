# events

Блок предоставляет набор JS-классов, реализующий механизмы работы с событиями.

## Обзор

### Классы, предоставляемые блоком

| Класс | Конструктор | Описание |
| ----- | ----------- | -------- |
| <a href="#class-Event">Event</a> | Event(<br>`type {String}`, <br>`target {Object}`) | Служит для создания объекта события, изменения и проверки его состояний. |
| <a href="#class-Emitter">Emitter</a> | - | Служит для генерации событий и подписки на них. |

### Свойства и методы объекта класса

| Класс | Имя | Тип или возвращаемое значение | Описание |
| ----- | --- | ----------------------------- | -------- |
| <a href="#class-Event">Event</a> | <a href="#fields-type">type</a> | `String` | Тип события. |
|  | <a href="#fields-result">result</a> | `*` | Результат, возвращенный последним обработчиком события. |
|  | <a href="#fields-target">target</a> | `Object` | Объект на котором возникло событие. |
|  | <a href="#fields-data">data</a> | `*` | Данные, передаваемые как аргумент обработчику. |
|  | <a href="#fields-preventDefault">preventDefault</a>()| - | Позволяет предотвратить выполнение стандартного действия предусмотренного для события. |
|  | <a href="#fields-isDefaultPrevented">isDefaultPrevented</a>()| `Boolean` | Проверяет, было ли предотвращено выполнение стандартного действия, предусмотренного для события. |
|  | <a href="#fields-stopPropagation">stopPropagation</a>()| - | Позволяет остановить всплывание события. |
|  | <a href="#fields-isPropagationStopped">isPropagationStopped</a>()| `Boolean` | Проверяет, было ли остановлено всплывание события. |
| <a href="#class-Emitter">Emitter</a> | <a href="#fields-on">on</a>(<br>`type {String}`, <br>`[data {Object}]`, <br>`fn {Function}`, <br>`[ {Object} ctx]`) | - | Служит для подписки на событие определенного типа. |
|  | <a href="#fields-once">once</a>(<br>`type {String}`, <br>`[data {Object}]`, <br>`fn {Function}`, <br>`[ctx {Object}]`) | - | Служит для подписки на событие определенного типа. Обработчик выполняется единожды. |
|  | <a href="#fields-un">un</a>(<br>`type {String}`, <br>`fn {Function}`, <br>`[ctx {Object}]`) | - | Служит для удаления подписки на событие определенного типа. |
|  | <a href="#fields-emit">emit</a>(<br>`type {String`&#124;`events:Event}`, <br>`[data {Object}]`) | - | Служит для генерации события. |

### Элементы блока

| Элемент | Способы использования | Описание |
| ------- | --------------------- | -------- |
| <a href="#elems-channels">channels</a> | `JS` | Предназначен для работы с именованными каналами событий. |

### Функции предоставляемые элементами блока

| Элемент | Функция | Тип возвращаемого значения | Описание |
| ------- | ------- | ----------------------------- | -------- |
| <a href="#elems-channels">channels</a> | channels(<br>`[id {String}]`, <br>`[drop {Boolean}]`) | `Object`&#124;`undefined` | Создает или удаляет именованный канал событий. |

### Публичные технологии блока

Блок реализован в технологиях:

* `vanilla.js`

## Описание

<a name="class-Event"></a>

### Класс `Event`

С помощью класса можно инстанцировать объект события, указав его тип и источник. Для этого нужно воспользоваться функцией-конструктором `Event`.

**Принимаемые аргументы:**

* `type {String}` – тип события. Обязательный аргумент.
* `target {Object}` – объект (источник) на котором событие возникло. Обязательный аргумент.

**Возвращаемое значение:** `Event`. Объект события.

<a name="fields-Event"></a>

#### Свойства и методы объекта класса

<a name="fields-type"></a>

##### Свойство `type`

Тип: `String`.

Тип события.

```js
modules.require(['events'], function(events) {

    var myevent = new events.Event('myevent', this);
    console.log(myevent.type); // 'myevent'

});
```

<a name="fields-type"></a>

##### Свойство `target`

Тип: `Object`.

Объект, на котором возникло событие.

<a name="fields-result"></a>

##### Свойство `result`

Тип: `*`.

Содержит данные, возвращаемые последней функцией-обработчиком события.

```js
modules.require(['events'], function(events) {

    var myEmitter = new events.Emitter();
    myEmitter.on('myevent', function() { return 'hi-hi-hi'; });

    var myEvent = new events.Event('myevent');
    myEmitter.emit(myEvent)

    console.log(myEvent.result);    // 'hi-hi-hi'
});
```

<a name="fields-data"></a>

##### Свойство `data`

Тип: `*`.

Содержит данные, передаваемые функции-обработчику события в качестве аргумента.

```js
modules.require(['events'], function(events) {

    var myEmitter = new events.Emitter();
    myEmitter.on('myevent', 'my-data', function(e) { console.log(e.data); });

    myEmitter.emit('myevent'); // my-data
});
```

<a name="fields-preventDefault"></a>

##### Метод `preventDefault`

Позволяет предотвратить выполнение стандартного действия предусмотренного для события.

Не принимает аргументов.

Не имеет возвращаемого значения.

<a name="fields-isDefaultPrevented"></a>

##### Метод `isDefaultPrevented`

Позволяет проверить было ли предотвращено выполнение стандартного действия для события.

Не принимает аргументов.

**Возвращаемое значение:** `Boolean`. В случае, если выполнение стандартного действия было предотвращено – `true`.

<a name="fields-stopPropagation"></a>

##### Метод `stopPropagation`

Позволяет остановить всплывание события.

Не принимает аргументов.

Не имеет возвращаемого значения.

<a name="fields-isPropagationStopped"></a>

##### Метод `isPropagationStopped`

Позволяет проверить, было ли остановлено всплывание события.

Не принимает аргументов.

**Возвращаемое значение:** `Boolean`. В случае, если всплывание события было остановлено – `true`.

<a name="class-Emitter"></a>

### Класс `Emitter`

Класс позволяет инстанцировать объекты, с помощью которых можно генерировать события и осуществлять подписку на них.

```js
modules.require(['events'], function(events) {

    var myEmitter = new events.Emitter();

});
```

<a name="fields-Event"></a>

#### Свойства и методы объекта класса

<a name="fields-on"></a>

##### Метод `on`

Служит для подписки на событие определенного типа.

**Принимаемые аргументы:**

* `type {String}` – тип события, на которое производится подписка. Обязательный аргумент.
* [`data {Object}`] – дополнительные данные, доступные обработчику как значение поля `e.data` объекта события.
* `fn {Function}` – функция-обработчик, вызываемая для события. Обязательный аргумент.
* [`ctx {Object}`] – контекст функции-обработчика.

Возвращает объект `this`.

```js
modules.require(['events'], function(events) {

    var myEmitter = new events.Emitter();

    myEmitter.on('myevent', function() { console.log('foo'); });
    myEmitter.emit('myevent'); // 'foo'
});
```

Кроме того, значением аргумента `type` могут быть:

* несколько типов событий, перечисленных через пробел – чтобы установить для них общую функцию-обработчик;

```js
modules.require(['events'], function(events) {

    var myEmitter = new events.Emitter();

    myEmitter.on('myevent1 myevent2', function(e) { console.log(e.type) });

    myEmitter.emit('myevent1'); // 'myevent1'
    myEmitter.emit('myevent2'); // 'myevent2'
});
```

* хеш вида `{ 'событие-1' : обработчик-1, ... , 'событие-n' : обработчик-n }` – чтобы установить сразу несколько обработчиков для разных типов событий;

```js
modules.require(['events'], function(events) {

    var myEmitter = new events.Emitter();

    myEmitter.on({
        myevent1 : function(e) { console.log(e.type) },
        myevent2 : function(e) { console.log(e.type) }
    });  

    myEmitter.emit('myevent1'); // 'myevent1'
    myEmitter.emit('myevent2'); // 'myevent2'
});
```

Сказанное выше верно и для методов `once` и `un`.

<a name="fields-once"></a>

##### Метод `once`

Идентичен методу `on`, но выполняется единожды – после первого события подписка удаляется.

**Принимаемые аргументы:**

* `type {String}` – тип события, на которое производится подписка. Обязательный аргумент.
* [`data {Object}`] – дополнительные данные, доступные как значение поля `e.data` объекта события.
* `fn {Function}` – функция-обработчик, вызываемая для события. Обязательный аргумент.
* [`ctx {Object}`] – контекст функции-обработчика.

Возвращает объект `this`.

```js
modules.require(['events'], function(events) {

    var myEmitter = new events.Emitter();

    myEmitter.on('myevent', function() { console.log('foo') });

    myEmitter.emit('myevent'); // 'foo'
    myEmitter.emit('myevent'); // обработчик не вызывается
});
```

<a name="fields-un"></a>

##### Метод `un`

Служит для удаления установленной ранее подписки на событие определенного типа.

**Принимаемые аргументы:**

* `type {String}` – тип события, подписка на которое удаляется. Обязательный аргумент.
* [`fn {Function}`] – удаляемый обработчик.
* [`ctx {Object}`] – контекст обработчика.

Метод возвращает ссылку на объект `this`.

```js
modules.require(['events'], function(events) {

    var myEmitter = new events.Emitter(),
        shout = function() { console.log('foo') };

    myEmitter.on('myevent', shout);
    myEmitter.emit('myevent'); // 'foo'

    myEmitter.un('myevent', shout);
    myEmitter.emit('myevent'); // обработчик не вызывается
});
```

<a name="fields-emit"></a>

##### Метод `emit`

Служит для генерации события.

Метод вызывает все функции-обработчики, заданные для события.

**Принимаемые аргументы:**

* `type {String|events:Event}` – генерируемое событие в виде строки или готового объекта события. Обязательный аргумент.
* [`data {Object}`] – дополнительные данные, доступные как второй аргумент функции-обработчика.

Возвращает объект `this`.

```js
modules.require(['events'], function(events) {

    var myEmitter = new events.Emitter();

    myEmitter.on('myevent', function(e, data) { console.log(data) });
    myEmitter.emit('myevent', 'ololo');  // 'ololo'
});
```

#### Статические методы класса

Набор и сигнатуры статических методов идентичны набору и сигнатурам методов объекта, инстанцируемого классом.
