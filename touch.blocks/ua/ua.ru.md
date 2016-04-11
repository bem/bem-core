# ua

На уровне `touch`, блок предоставляет объект, содержащий набор свойств, указывающих особенности мобильного устройства.

## Обзор

### Свойства и методы объекта

| Имя | Тип | Описание |
| --- | --- | -------- |
| <a href="#fields-ua">ua</a> | <code>{String}</code> | Значение HTTP-заголовка юзер-агента. |
| <a href="#fields-ios">ios</a> | <code>{String}</code>&#124;<code>{undefined}</code> | Версия мобильной платформы iOS. |
| <a href="#fields-android">android</a> | <code>{String}</code>&#124;<code>{undefined}</code> | Версия мобильной платформы Android. |
| <a href="#fields-bada">bada</a> | <code>{String}</code>&#124;<code>{undefined}</code> | Версия мобильной платформы Bada OS. |
| <a href="#fields-wp">wp</a> | <code>{String}</code>&#124;<code>{undefined}</code> | Версия мобильной платформы Windows Phone. |
| <a href="#fields-other">other</a> | <code>{Boolean}</code> | Мобильная платформа неопределена. |
| <a href="#fields-opera">opera</a> | <code>{String}</code> | Версия браузера Opera. |
| <a href="#fields-chrome">chrome</a> | <code>{String}</code> | Версия браузера Chrome. |
| <a href="#fields-iphone">iphone</a> | <code>{Boolean}</code> | Устройство – iPhone. |
| <a href="#fields-ipad">ipad</a> | <code>{Boolean}</code> | Устройство – iPad. |
| <a href="#fields-screenSize">screenSize</a> | <code>{String}</code> | Размер экрана устройства. |
| <a href="#fields-connection">connection</a> | <code>{String}</code> | Тип активного соединения. |
| <a href="#fields-dpr">dpr</a> | <code>{Number}</code> | Относительная плотность пикселей. |
| <a href="#fields-flash">flash</a> | <code>{String}</code>&#124;<code>{undefined}</code> | Версия Adobe Flash. |
| <a href="#fields-video">video</a> | <code>{Boolean}</code> | Поддержка видео. |
| <a href="#fields-width">width</a> | <code>{Number}</code> | Ширина рабочей области экрана в px. |
| <a href="#fields-height">height</a> | <code>{Number}</code> | Высота рабочей области экрана в px. |
| <a href="#fields-landscape">landscape</a> | <code>{Boolean}</code> | Ориентация устройства. |

### Элементы блока

| Элемент | Способы использования | Описание |
| ------- | --------------------- | -------- |
| <a href="#elems-dom">dom</a> | `JS` | Предоставляет набор модификаторов на основании свойств блока `ua` на тач-уровне. |

### Модификаторы элемента блока

| Элемент | Модификатор | Допустимые значения | Способы использования | Описание |
| ------- | ----------- | ------------------- | --------------------- | -------- |
| <a href="#elems-dom">dom</a> | <a href="#modifiers-platform">platform</a> | `'ios'`, `'android'`, `'bada'`, `'wp'`, `'other'` | `JS` | Мобильная платформа пользовательского устройства. |
|  | <a href="#modifiers-browser">browser</a> | `'opera'`, `'chrome'` | `JS` | Тип браузера. |
|  | <a href="#modifiers-ios">ios</a> | `'8'`, `'7'` ... | `JS` | Версия операционной системы для устройств iOS. |
|  | <a href="#modifiers-ios-subversion">ios-subversion</a> | `'81'`, `'80'` ... | `JS` | Подверсия операционной системы для устройств iOS. |
|  | <a href="#modifiers-android">android</a> | `'4'`, `'3'` ... | `JS` | Версия операционной системы для устройств Android. |
|  | <a href="#modifiers-screen-size">screen-size</a> | `'large'`, `'normal'`, `'small'` | `JS` | Размер экрана устройства. |
|  | <a href="#modifiers-svg">svg</a> | `'yes'`, `'no'` | `JS` | Поддержка формата SVG. |
|  | <a href="#modifiers-orient">orient</a> | `'landscape'`, `'portrait'` | `JS` | Ориентация устройства. |

### Публичные технологии блока

Блок реализован в технологиях:

* `js`
* `bh.js`
* `bemhtml`

## Подробности

Блок позволяет определить:

* Версию мобильной платформы.
* Типа браузера.
* Версию браузера.
* Тип соединения.
* Наличие поддержки видео и SVG.
* Поддержку технологии Adobe Flash.
* Ориентацию и размер экрана.
* Соотношение сторон экрана устройства.

```js
modules.require('ua', function(ua) {

console.dir(ua);

});
```


<a name="fields"></a>
### Свойства и методы объекта

<a name="fields-ua"></a>
#### Свойство `ua`

Тип: `{String}`.

Тип мобильного браузера.

<a name="fields-ios"></a>
#### Свойство `ios`

Тип: `{String|undefined}`.

Версия мобильной платформы. Строка с номером версии, если платформа распознана как iOS.

<a name="fields-android"></a>
#### Свойство `android`

Тип: `{String|undefined}`.

Версия мобильной платформы. Строка с номером версии, если платформа распознана как Android.

<a name="fields-bada"></a>
#### Свойство `bada`

Тип: `{String|undefined}`.

Версия мобильной платформы. Строка с номером версии, если платформа распознана как Bada OS.

<a name="fields-wp"></a>
#### Свойство `wp`

Тип: `{String|undefined}`.

Версия мобильной платформы. Строка с номером версии, если платформа распознана как Windows Phone.

<a name="fields-other"></a>
#### Свойство `other`

Тип: `{Boolean}`.

Мобильная платформа неопределена. Устанавливается в значение `true` для всех мобильных платформ, кроме вышеперечисленных.


<a name="fields-opera"></a>
#### Свойство `opera`

Тип: `{String}`.

Версия браузера Opera.

<a name="fields-chrome"></a>
#### Свойство `chrome`

Тип: `{String}`.

Версия браузера Chrome.

<a name="fields-iphone"></a>
#### Свойство `iphone`

Тип: `{Boolean}`.

Значение `true` характеризует устройство как iPhone.

<a name="fields-ipad"></a>
#### Свойство `ipad`

Тип: `{Boolean}`.

Значение `true` характеризует устройство как iPad.

<a name="fields-screenSize"></a>
#### Свойство `screenSize`

Тип: `{String}`.

Размер экрана устройства.

Доступны следующие значения:

* `large` – размер экрана больше 320 px.
* `normal` – размер экрана равен 320 px.
* `small` – размер экрана меньше 320 px.

<a name="fields-connection"></a>
#### Свойство `connection`

Тип: `{String}`.

Тип активного сетевого соединения.

Доступны следующие значения:

* `wifi` – соединение по Wi-Fi.
* `3g` – соединение по 3G.
* `2g` – соединение по EDGE и GSM.

<a name="fields-dpr"></a>
#### Свойство `dpr`

Тип: `{Number}`.

Коэффициент относительной плотности пикселей. Характеризует отношение физических пикселей устройства к аппаратно независимым (dppx). Позволяет определить использует ли устройство дисплей с повышенной плотностью пикселей (например, Retina). По умолчанию `1`.

Например, можно проверить, что устройство использует Retina и отдавать браузеру изображения с высоким разрешением:

```js
modules.require('ua', function(ua) {

var imgFile = ua.dpr === 1 ? 'image.png' : 'image@2x.png';
// ···

});
```

<a name="fields-flash"></a>
#### Свойство `flash`

Тип: `{String|undefined}`.

Версия Adobe Flash. `undefined`, если Flash недоступен.

<a name="fields-video"></a>
#### Свойство `video`

Тип: `{Boolean}`.

Значение `true`, если видео поддерживается.

<a name="fields-svg"></a>
#### Свойство `svg`

Тип: `{Boolean}`.

Значение `true`, если SVG поддерживается.

<a name="fields-width"></a>
#### Свойство `width`

Тип: `{Number}`.

Ширина рабочей области экрана в пикселях.

<a name="fields-height"></a>
#### Свойство `height`

Тип: `{Number}`.

Высота рабочей области экрана в пикселях.


<a name="fields-landscape"></a>
#### Свойство `landscape`

Тип: `{Boolean}`.

Значение `true` при горизонтальной ориентации.
