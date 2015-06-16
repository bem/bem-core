# inherit

Блок предоставляет функцию, реализующую механизмы псевдоклассового наследования, и позволяет:

* создавать псевдокласс по декларации;
* задавать метод-конструктор;
* использовать миксины;
* вызывать методы базового блока (super call);
* использовать статические члены функции;
* получать доступ к статическим методам «класса» из его прототипа.

Функция позволяет определить базовый «класс». А затем наследовать его логику, доопределяя ее новыми методами. 

Блок `inherit` реализован в технологии `vanila.js` и подходит для использования как на клиенте, так и на сервере.

Блок является основой механизма наследования блоков в `bem-core`. Базовый блок `bem` наследуется с помощью `inherit` от «класса» `Emitter` блока `events`:

```js
var bem = inherit(events.Emitter, /** @lends bem.prototype */ { ... }, { ... });
```

Все остальные блоки наследуются от блока `bem` (или `bemDom` для блоков с DOM-представлением). Иначе говоря, доопределяют декларацию блока `BEM`.

## Объявление базового «класса»

Чтобы объявить базовый «класс» нужно воспользоваться функцией, реализованной блоком. Например, в декларации блока с автоинициализацией: 

```js
modules.define('test1', ['inherit'], function(provide, inherit) {

provide(this.name, /** @lends test1.prototype */{
            'myInherit' : function(props) {
                // base 'class'
                return inherit(props);
            }
});
});
```

Функция принимает на вход объект и возвращает полностью сформированную функцию-конструктор:

```js
Function inherit(Object props);
```


### Базовый «класс» со статическими свойствами

При объявлении базового «класса» методу `inherit` можно передать вторым аргументом объект статических свойств:

```js
Function inherit(
    Object props,
    Object staticProps
);
```

Свойства из объекта `staticProps` будут добавлены как статические к создаваемой функции-конструктору:

```js
var A = inherit(props, {
    callMe : function() {
        console.log('mr.Static');
    }
});

A.callMe(); // mr.Static
```

**NB** Статические методы функции-конструктора выполняются в контексте самой функции. Например, ссылка `this` внутри метода `callMe` будет указывать на функцию `A`.


### Метод `__constructor`

Объект, на основе которого конструируется базовый «класс», может иметь зарезервированное свойство `__constructor`. Значением этого свойства должна быть функция, которая будет автоматически вызвана при создании экземпляра «класса».

Использование `__constructor` позволяет задавать динамические свойства экземпляра «класса»:

```js
var A = inherit(/** @lends A.prototype */{
    __constructor : function(property) { // constructor
        this.property = property;
    },

    getProperty : function() {
        return this.property + ' of instanceA';
    }
}),
    aInst = new A('Property');

aInst.getProperty(); // Property of instanceA
```


## Создание производного «класса»

Для создания производного «класса» методу `inherit` первым аргументом передается функция – базовый «класс»:

```js
Function inherit(
    Function BaseClass,
    Object props,
    Object staticProps);
```

Второй и третий аргументы – объекты со свойствами производного «класса»:

* `props` – собственные свойства (добавляются к прототипу).
* `staticProps` – статические свойства.

Если один из объектов содержит свойства, которые уже есть в базовом «классе» – свойства базового «класса» переопределятся. Иначе говоря, производный «класс» будет содержать значения из объекта.


### Создание производного «класса» с миксинами

При объявлении производного «класса» можно указать дополнительный набор функций. Их свойства будут примешаны к создаваемому «классу». Для этого первым аргументом (базовый «класс») нужно указать массив. Его первым элементом должен быть базовый «класс», последующими – примешиваемые функции:

```js
Function inherit(
    [
        Function BaseClass,
        Function Mixin,
        Function AnotherMixin,
        ...
    ],
    Object props,
    Object staticProps);
```


## Специальные поля

### `__self`

Поле позволяет получить доступ к статическим свойствам функции-конструктора непосредственно из ее прототипа:

```js
var A = inherit(/** @lends A.prototype */{
    getStaticProperty : function() {
        return this.__self.staticMethod; // access to static
    }
}, /** @lends A */ {    
    staticProperty : 'staticA',

    staticMethod : function() {
        return this.staticProperty;
    }
}),
    aInst = new A();
aInst.getStaticProperty(); //staticA
```


### `__base`

Поле позволяет внутри производного «класса» использовать методы базового (supercall). Поле `__base` позволяет вызвать так же статические методы базового «класса»:

```js
var A = inherit(/** @lends A.prototype */{
    getType : function() {
        return 'A';
    }
}, /** @lends A */ {    
    staticProperty : 'staticA',

    staticMethod : function() {
        return this.staticProperty;
    }
});

// inherited 'class' from A
var B = inherit(A, /** @lends B.prototype */{
    getType : function() { // overriding + 'super' call
        return this.__base() + 'B';
    }
}, /** @lends B */ {
    staticMethod : function() { // static overriding + 'super' call
        return this.__base() + ' of staticB';
    }
});

var instanceOfB = new B();

instanceOfB.getType(); // returns 'AB'
B.staticMethod(); // returns 'staticA of staticB'
```


## Расширенный пример

Ниже приведен пример модуля, использующего все основные способы наследования блока `inherit`:

```js
// base 'class'
var A = inherit(/** @lends A.prototype */{
    __constructor : function(property) { // constructor
        this.property = property;
    },

    getProperty : function() {
        return this.property + ' of instanceA';
    },

    getType : function() {
        return 'A';
    },

    getStaticProperty : function() {
        return this.__self.staticMethod; // access to static
    }
}, /** @lends A */ {    
    staticProperty : 'staticA',

    staticMethod : function() {
        return this.staticProperty;
    }
});

// inherited 'class' from A
var B = inherit(A, /** @lends B.prototype */{
    getProperty : function() { // overriding
        return this.property + ' of instanceB';
    },

    getType : function() { // overriding + 'super' call
        return this.__base() + 'B';
    }
}, /** @lends B */ {
    staticMethod : function() { // static overriding + 'super' call
        return this.__base() + ' of staticB';
    }
});

// mixin M
var M = inherit({
    getMixedProperty : function() {
        return 'mixed property';
    }
});

// inherited 'class' from A with mixin M
var C = inherit([A, M], {
    getMixedProperty : function() {
        return this.__base() + ' from C';
    }
});

var instanceOfB = new B('property');

instanceOfB.getProperty(); // returns 'property of instanceB'
instanceOfB.getType(); // returns 'AB'
B.staticMethod(); // returns 'staticA of staticB'

var instanceOfC = new C();
instanceOfC.getMixedProperty(); // returns 'mixed property from C'
```
