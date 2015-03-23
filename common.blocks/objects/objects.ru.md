# objects

Блок предоставляет объект, содержащий набор методов для работы с объектами JavaScript.

## Обзор

### Свойства и методы объекта

| Имя | Тип или возвращаемое значение | Описание |
| -------- | --- | -------- |
| <a href="#fields-extend">extend</a>(<br><code>{Object} target</code>, <br><code>{Object} source</code></code>) | <code>{Object}</code> | Позволяет расширять объект свойствами другого объекта. |
| <a href="#fields-isEmpty">isEmpty</a>(<code>{Object} obj</code> | <code>{Boolean}</code> |  Позволяет выяснить пуст ли переданный объект. |
| <a href="#fields-each">each</a>(<br><code>{Object} obj</code>, <br><code>{Function} fn</code>, <br><code>[{Object} ctx]</code>) | - | Служит для итеративного обхода собственных свойств объекта. |

### Публичные технологии блока

Блок реализован в технологиях:

* `vanilla.js`

## Подробности

<a name="fields"></a>
### Свойства и методы объекта

<a name="fields-extend"></a>
#### Метод `extend`

Позволяет расширять объект свойствами другого объекта. Копируются только собственные свойства, не полученные по цепочке прототипов.

Принимаемые аргументы: 

* `target` `{Object}` – целевой объект, который расширяется свойствами других. Обязательный аргумент.
* `source` `{Object}` – объект, свойства которого добавляются к целевому. Может быть передано несколько объектов. Свойства каждого из них будут добавлены к целевому. Обязательный аргумент.

Возвращаемое значение: `{Object}`. Целевой объект с добавленными свойствами.

```js
modules.require(['objects'], function(objects) {
    var obj1 = { a : 1, b : 2 },
        obj2 = { b : 3, c : 4 };

    console.log(objects.extend(obj1, obj2)); // { a : 1, b : 3, c : 4 }
});
```


<a name="fields-isEmpty"></a>
#### Метод `isEmpty`

Позволяет выяснить пуст ли переданный объект. Другими словами, имеет ли объект собственные свойства.

Принимаемые аргументы: 

* `obj` `{Object}` – объект для проверки. Обязательный аргумент.

Возвращаемое значение: `{Boolean}`. В случае, если объект не имеет собственных свойств – `true`.

```js
modules.require(['objects'], function(objects) {
    var obj1 = {},
        obj2 = { foo : 'bar' };

    console.log(objects.isEmpty(obj1)); // true
    console.log(objects.isEmpty(obj2)); // false
});
```

<a name="fields-each"></a>
#### Метод `each`

Служит для итеративного обхода собственных свойств объекта. Для каждого собственного свойства вызывается функция-callback. 

Принимаемые аргументы:

* `obj` `{Object}` – объект обход свойств которого производится. Обязательный аргумент.
* `fn` `{Function}` – функция-обработчик, вызываемая для каждого свойства. Обязательный аргумент.
* [`ctx` `{Object}`] – контекст обработчика.

Не имеет возвращаемого значения. 

Первым аргументом обработчик получает значение свойства объекта, для которого была вызвана, вторым имя свойства.

```js
modules.require(['objects'], function(objects) {
    var obj1 = { a : 1, b : 2, c : 4 },
        logValue = function(val) {
            console.log(val);
        };

    objects.each(obj1, logValue); // 124
});
```


<a name="extra-examples"></a>
###Дополнительные примеры

`objects` в библиотеке `bem-components`:

* блок `popup` [с модификатором target](https://github.com/bem/bem-components/blob/v2/common.blocks/popup/_target/popup_target.js#L82).
