# cookie

Блок предоставляет объект, содержащий набор методов для работы с cookie браузера (JS-свойство `document.cookie`).

## Обзор

### Свойства и методы объекта

| Имя | Тип возвращаемого значения | Описание |
| -------- | --- | -------- |
| <a href="#fields-get">get</a>(`name`) | `String` &#124; `null` | Служит для получения значения, хранящегося в cookie браузера. |
| <a href="#fields-set">set</a>(`name`, `val`, `[options]`) | `String` | Cлужит для записи cookie с заданным именем.|

### Публичные технологии блока

Блок реализован в технологиях:

* `js`

## Описание

<a name="fields"></a>

### Свойства и методы объекта

<a name="fields-get"></a>

#### Метод `get`

Метод служит для получения значения, хранящегося в cookie, для имени переданного аргументом.

**Принимаемые аргументы:**

| Аргумент | Тип | Описание |
| ------- | --- | -------- |
| `name`&#42; | `String` | Имя cookie. |

&#42; Обязательный аргумент.

**Возвращает:**

* `String` — если cookie с заданным именем было установлено. Значение автоматически декодируется с помощью [decodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent).
* `null` — если cookie с заданным именем отсутствует.

Пример:

```js
modules.require('cookie', function(cookie) {

    cookie.set('mycookie', 'foobar');
    console.log(cookie.get('mycookie')); // 'foobar'
    console.log(cookie.get('foo')); // null

});
```

<a name="fields-set"></a>

#### Метод `set`

Метод служит для записи cookie с заданным именем. Помимо имени и значения, методу можно передать хеш с дополнительными параметрами cookie.

**Принимаемые аргументы:**

| Аргумент | Тип | Описание |
| ------- | --- | -------- |
| `name`&#42; | `String` | Имя cookie. |
| `val`&#42; | `String` &#124; `null` | Значение cookie. При установке в качестве значения `null` cookie удаляется.|
| [`options`] | `Object` | Опции. </br></br> Свойства объекта: </br></br> &#8226; `expires` (`Number`) – срок жизни cookie в сутках. При отрицательном значении cookie будет удалено. Альтернативно, можно передать в качестве значения сформированный объект даты (`new Date()`). </br> &#8226; `path` (`String`) – путь от корня домена внутри которого будет доступно cookie. </br> &#8226; `domain` (`String`) – домен. По умолчанию текущий домен. </br> &#8226; `secure` (`Boolean`) – флаг, указывающий на необходимость использования с cookie шифрованного соединения SSL. По умолчанию `false`. |

&#42; Обязательный аргумент.

**Возвращает:** объект `this`.

Пример:

```js
modules.require('cookie', function(cookie) {

    cookie.set('mycookie', 'foobar', {
        expires : 1, // срок жизни одни сутки
        path : '/', // доступно для всех страниц
        secure : true // передавать cookie только по SSL
    });

    console.log(cookie.get('mycookie')); // 'foobar'

    cookie.set('mycookie', null); // удаляем cookie
    console.log(cookie.get('mycookie')); // null

});
```
