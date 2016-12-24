# jquery

Блок служит для загрузки и подключения на страницу библиотеки [jQuery](https://jquery.com) и ее расширений.
Расширения подключаются через зависимости от элементов блока.

## Способы использования

```js
modules.require(['jquery'], function($) {
    console.log($);
});
```

## Обзор

### Элементы блока

| Элемент | Способы использования | Описание |
| --------| --------------------- | -------- |
| <a href="#elems-config">config</a> | `JS` | Настройки jQuery. |
| <a href="#elems-event">event</a> | `JS` | Расширения событийной модели jQuery. |

### Свойства и методы элементов блока

| Элемент| Имя | Тип возвращаемого значения | Описание |
| -------| --- | ----------------------------- | -------- |
| <a href="#elems-config">config</a> | <a href="#fields-url">url</a> | `String` | Строка с URL, подключаемой библиотеки jQuery. |

### События элементов блока

| Элемент | Имя | Описание |
| ------- | --- | -------- |
| <a href="#elems-event">event</a> | <a href="#events-pointerclick">pointerclick</a> | Позволяет избавиться от задержки события `click` на тач-устройствах. |
|  | <a href="#events-pointerover">pointerover</a> | Генерируется, когда указатель устройства ввода находится над элементом. |
|  | <a href="#events-pointerenter">pointerenter</a> | Генерируется при входе указателя в активную зону элемента. |
|  | <a href="#events-pointerdown">pointerdown</a> | Генерируется при входе устройства ввода в состояние активного нажатия. |
|  | <a href="#events-pointermove">pointermove</a> | Генерируется при изменении координат указателя. |
|  | <a href="#events-pointerup">pointerup</a> | Генерируется по выходу из состояния активного нажатия. |
|  | <a href="#events-pointerout">pointerout</a> | Генерируется когда указатель покидает зону над элементаом. |
|  | <a href="#events-pointerleave">pointerleave</a> | Генерируется при выходе указателя из активной зоны элемента. |
|  | <a href="#events-pointerpress">pointerpress</a> | Генерируется по событию `pointerdown`. |
|  | <a href="#events-pointerrelease">pointerrelease</a> | Генерируется по событиям `pointerup` и `pointercancel`. |
|  | <a href="#events-pointercancel">pointercancel</a> | Генерируется в случаях, когда не предполагается дальнейшее возникновение pointer-событий или после генерации события `pointerdown`. |

### Публичные технологии блока

Блок реализован в технологиях:

* `js`
