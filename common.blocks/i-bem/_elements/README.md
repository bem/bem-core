С помощью этого расширения можно работать с элементами почти так же, как и с обычными блоками, т.е. любой (но не обязательно каждый) элемент может иметь свой BEM-инстанс. API инстансов элементов аналогично API блоков с некоторыми различиями, описанными ниже.

### Декларация

Декларация элемента

```javascript
BEM.DOM.decl({ block: 'menu', elem: 'item' }, { /* properties */ }, { /* static properties */ });
```

Декларация модификатора элемента:

```javascript
BEM.DOM.decl({
    block: 'menu',
    elem: 'item',
    modName: 'state',
    modVal: 'current'
}, {
    /* properties */
}, {
    /* static properties */
});
```

Модификаторы элементов работают также, как модификаторы блоков.

### BEM-инстансы элементов

Для доступа к BEM-инстансам элементов используется хелпер ```findElements```, API которого аналогично нативному методу ```findElem```:

```javascript
this.findElements('item');                                  // поиск всех вложенных элементов 'item'
this.findElements('item', true);                            // строгий поиск всех вложенных элементов 'item'
this.findElements('item', 'state', 'current');              // поиск всех вложенных модификаторов элементов 'item'
this.findElements('item', 'state', 'current', true);        // строгий поиск всех вложенных модификаторов элементов 'item'
this.findElements(ctx, 'item');                             // поиск всех элементов 'item' внутри указанного контекста
this.findElements(ctx, 'item', true);                       // строгий поиск всех элементов 'item' внутри указанного контекста
this.findElements(ctx, 'item', 'state', 'current');         // поиск всех модификаторов элементов 'item' внутри указанного контекста
this.findElements(ctx, 'item', 'state', 'current', true);   // строгий поиск всех модификаторов элементов 'item' внутри указанного контекста
```

При необходимости, инстансы найденных элементов инициализируются.

Строгий поиск подразумевает фильтрацию элементов вложенных блоков с таким же именем, как у текущего блока:

```javascript
// BEMJSON:
{
    block: 'menu',
    content: [
        {
            elem: 'item' // (1)
        },
        {
            block: 'menu',
            content: {
                elem: 'item' // (2)
            }
        }
    ]
}
```
```javascript
// this => block 'menu'
this.findElements('item'); // найдет инстансы (1) и (2)
this.findElements('item', true); // найдет только инстанс (1)
```

По аналогии с хелпером ```elem```, кэширующим результаты своей работы, для минимизации количества операций с DOM рекомендуется использовать кэширующий поиск BEM-инстансов элементов:

```javascript
this.elements('item');                      // кэширующий поиск всех вложенных элементов 'item'
this.elements('item', 'state', 'current');  // кэширующий поиск всех вложенных модификаторов элемента 'item'
```

Также с помощью этого хелпера можно:

```javascript
this.elements(domElem);     // вернуть инстансы элементов, расположенных на DOM-нодах указанной jQuery-коллекции
```

Для поиска одного (первого) BEM-инстанса элемента есть дополнительные формы этих хелперов с аналогичным API:

```javascript
this.findElement('item');   // поиск одного вложенного элемента 'item'
this.element('item');       // кэширующий поиск одного вложенного элемента 'item'
this.element(domElem);      // вернуть инстанс элемента, расположенного на первой DOM-ноде указанной jQuery-коллекции
```

Если необходимо вернуть BEM-инстанс элемента, на DOM-ноде которого подмешаны другие элементы того же блока:

```javascript
this.element(this.elemify(domElem, 'item'));
```

### Поиск снаружи контекста

Существует хелпер для поиска элемента снаружи указанного контекста:

```javascript
// BEMJSON:
{
    block: 'menu',
    content: {
        elem: 'item',
        content: {
            elem: 'link'
        }
    }
}
```
```javascript
// this => block 'menu'
this.closestElem(this.elem('link'), 'item');
```

При поиске от имени BEM-инстанса элемента можно не указывать контекст поиска, тогда поиск будет производиться относительно DOM-ноды этого элемента:

```javascript
// this => element 'menu__link'
this.closestElem('item');
```

По аналогии с хелперами ```elem``` и ```findElem```, хелпер ```closestElem``` возвращает jQuery-коллекцию. Для доступа к BEM-инстансам элементов снаружи контекста используются хелперы ```closestElement``` и ```closestElements```:

```javascript
// this => block 'menu'
this.closestElement(this.elem('link'), 'item');
this.closestElements(this.elem('link'), 'item');
```
```javascript
// this => element 'menu__link'
this.closestElement('item');
```

### Доступ к родительскому блоку

По аналогии с методом `elem` для получения элемента блока существует метод `block` для получения блока элемента.

```javascript
// this => element 'menu__item'
this.block() // эквивалентно this.findBlockOutside('menu') с кэшированием результата поиска
```

### Поиск элементов и блоков

Элемент ищет только вложенные в него элементы:

```javascript
// BEMJSON:
{
    block: 'menu',
    content: [
        {
            elem: 'item',
            content: {
                elem: 'link' // (1)
            }
        },
        {
            elem: 'link' // (2)
        }
    ]
}
```

```javascript
// this => element 'menu__item'
this.findElem('link');  // будет найден только элемент (1).
```

Если нужно найти все элементы ```'link'```, поиск нужно производить от имени блока-родителя:

```javascript
// this => element 'menu__item'
this.block().findElem('link');    // будут найдены элементы (1) и (2).
```

Все это справедливо также для хелпера ```elem```, хелперов поиска блоков (```findBlockInside``` и др.) и описанных выше хелперов для поиска BEM-инстансов элементов.

### Реакция на установку модификаторов

Блок делегирует установку модификаторов тем элементам, у которых есть свои BEM-декларации.
Поэму обработчики ```onSetMod``` элемента выполнятся, если родительский блок установит этому элементу соответствующие модификаторы:

```javascript
// this => element 'menu__item'
onSetMod: {
    'state': {
        'current': function() {
            // код обработичка
        }
    }
}
```
```javascript
// this => block 'menu'
this.setMod(this.elem('item'), 'state', 'current'); // выполнится задекларированный выше обработчик
```

Обработчики ```onElemSetMod``` блока выполнятся, если инстанс элемента сам установит себе соответствующие модификаторы:

```javascript
// this => block 'menu'
onElemSetMod: {
    'item': {
        'state': {
            'current': function() {
                // код обработичка
            }
        }
    }
}
```
```javascript
// this => element 'menu__item'
this.setMod('state', 'current'); // выполнится задекларированный выше обработчик
```

Обработчики ```onElemSetMod``` в контексте инстанса элемента не используются.

### Отложенная инициализация и live-события

Рекомендуется по возможности всегда использовать отложенную инициализацию BEM-инстансов элементов. Они, как и обычные блоки, поддерживают все хелперы для работы с live-событиями. Кроме того, хелпер ```liveInitOnBlockEvent``` имеет дополнительную форму для инициализации по событию родительского блока - для этого просто опускается второй параметр (имя блока):

```javascript
this.liveInitOnBlockEvent('switch', function() { /* обработчик */ });
```