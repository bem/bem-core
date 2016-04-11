<a name="#elems-dom">
# Элемент `dom` блока `ua`

Элемент служит для дополнения базовой БЭМ-сущности блока `ua` набором модификаторов на основе данных, собранных блоком `ua` на touch-уровне.

Это позволяет учитывать особенности мобильного устройства, проверяя наличие и значение модификаторов.

```js
modules.define('ios-test', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl(this.name, {
    onSetMod: {
        js: {
            inited: function() {
                this.findBlockOutside('ua').hasMod('platform', 'ios') &&
                    this.setMod('ios');
            }
        },
        'ios': function() {
            console.log('You are iOS user');
        }
    }
}));

});
```

Элемент автоматически подключается с блоком `page`. Не требуется подключать его вручную, если в проекте используется `page`.

<a name="modifiers"></a>
## Модификаторы элемента

Значения всех модификаторов элемента, кроме `orient`, устанавливаются в момент инициализации блока и остаются неизменными.

<a name="modifiers-platform"></a>
### Модификатор `platform`

Допустимые значения: `'ios'`, `'android'`, `'bada'`, `'wp'`, `'other'`.

Способ использования: `JS`.

Модификатор указывает мобильную платформу пользовательского устройства.

* `ios` – iOS.
* `android` – Android.
* `bada` – Bada OS.
* `wp` – Windows Phone.
* `other` – все остальные мобильные платформы.

<a name="modifiers-browser"></a>
### Модификатор `browser`

Допустимые значения: `'opera'`, `'chrome'`.

Способ использования: `JS`.

Модификатор указывает тип мобильного браузера.

* `opera` – Opera.
* `chrome` – Chrome.

<a name="modifiers-ios"></a>
### Модификатор `ios`

Допустимые значения: `'8'`, `'7'` ...

Способ использования: `JS`.

Модификатор указывает версию операционной системы для устройств iOS.

<a name="modifiers-ios-subversion"></a>
### Модификатор `ios-subversion`

Допустимые значения: `'81'`, `'80'` ...

Способ использования: `JS`.

Модификатор указывает подверсию операционной системы для устройств iOS. Номер подверсии состоит из номера версии и первого символа после разделителя. Номер указывается без символов-разделителей `'.'`. Например, для iOS версии 8.1.3 значением модификатора будет `'81'`.

<a name="modifiers-android"></a>
### Модификатор `android`

Допустимые значения: `'4'`, `'3'` ...

Способ использования: `JS`.

Модификатор указывает версию операционной системы для устройств Android.

<a name="modifiers-screen-size"></a>
### Модификатор `screen-size`

Допустимые значения: `'large'`, `'normal'`, `'small'`.

Способ использования: `JS`.

Модификатор указывает размер экрана пользовательского устройства.

* `large` – размер экрана больше 320 px.
* `normal` – размер экрана равен 320 px.
* `small` – размер экрана меньше 320 px.

<a name="modifiers-svg"></a>
### Модификатор `svg`

Допустимые значения: `'yes'`, `'no'`.

Способ использования: `JS`.

Модификатор указывает на наличие у пользовательского устройства поддержки формата SVG.

* `yes` – поддержка SVG присутствует.
* `no` – поддержка SVG отсутствует.

<a name="modifiers-orient"></a>
### Модификатор `orient`

Допустимые значения: `'landscape'`, `'portrait'`.

Способ использования: `JS`.

Модификатор указывает текущую ориентацию устройства.

* `landscape` – горизонтальная ориентация.
* `portrait` – вертикальная ориентация.

Значение модификатора изменяется динамически при смене ориентации устройства. Поэтому можно подписываться на изменение значения модификатора:

```js
modules.define('inner', ['i-bem__dom'], function(provide, BEMDOM) {

provide(BEMDOM.decl(this.name, {
    onSetMod: {
        js: {
            inited: function() {
                this._ua = this
                    .findBlockOutside('ua')
                    .on({ modName : 'orient', modVal : '*' }, this._onOrientChange, this);

                this.setMod('orient', this._ua.getMod('orient'));
            },
            '': function() {
                this._ua.un({ modName : 'orient', modVal : '*' }, this._onOrientChange, this);
            }
        },

        'orient': {
            'portrait': function() {
                this._reDraw('portrait');
            },
            'landscape': function() {
                this._reDraw('landscape');
            }
        }
    },

    _onOrientChange: function(e, data) {
        // переключаемся между значениям собственного модификатора `orient`
        this.setMod(data.modName, data.modVal);
    },

    _reDraw: function(orient) {
        // обновляем содержимое контейнера `inner` при смене ориентации устройства
        console.log(orient);
        BEMDOM.update(this.domElem, orient);
    }
}));

});
```

В примере блок-контейнер `inner`, вложенный в `page`, подменяет свое содержимое при смене ориентации устройства.
