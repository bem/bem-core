Подключение данного модификатора позволяет работать с элементами почти так же, как и с обычными блоками, т.е. любой (но не обязательно каждый) элемент может иметь свой BEM-инстанс. API инстансов элементов аналогично API блоков с некоторыми различиями, описанными ниже.

### Декларация

Декларация элемента

```javascript
BEMDOM.decl({ block: 'menu', elem: 'item' }, { /* properties */ }, { /* static properties */ });
```

Декларация модификатора элемента:

```javascript
BEMDOM.decl({
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

Модификаторы элементов работают так же, как модификаторы блоков.

### BEM-инстансы элементов

Для доступа к BEM-инстансам элементов используется хелпер ```findElemInstances```, API которого аналогично хелперу ```findElem```:

```javascript
// поиск всех вложенных элементов 'item'
this.findElemInstances('item');

// строгий поиск всех вложенных элементов 'item'
this.findElemInstances('item', true);

// поиск всех вложенных модификаторов элементов 'item'
this.findElemInstances('item', 'state', 'current');

// строгий поиск всех вложенных модификаторов элементов 'item'
this.findElemInstances('item', 'state', 'current', true);

// поиск всех элементов 'item' внутри указанного контекста
this.findElemInstances(ctx, 'item');

// строгий поиск всех элементов 'item' внутри указанного контекста
this.findElemInstances(ctx, 'item', true);

// поиск всех модификаторов элементов 'item' внутри указанного контекста
this.findElemInstances(ctx, 'item', 'state', 'current');

// строгий поиск всех модификаторов элементов 'item' внутри указанного контекста
this.findElemInstances(ctx, 'item', 'state', 'current', true);
```

При необходимости, инстансы найденных элементов инициализируются.

Строгий поиск подразумевает фильтрацию элементов вложенных блоков с таким же именем, как у текущего блока:

```javascript
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
this.findElemInstances('item');         // найдет инстансы (1) и (2)
this.findElemInstances('item', true);   // найдет только инстанс (1)
```

По аналогии с хелпером ```elem```, кэширующим результаты своей работы, для минимизации количества операций с DOM рекомендуется использовать кэширующий поиск BEM-инстансов элементов:

```javascript
// кэширующий поиск всех вложенных элементов 'item'
this.elemInstances('item');

// кэширующий поиск всех вложенных модификаторов элемента 'item'
this.elemInstances('item', 'state', 'current');
```

Также с помощью этого хелпера можно вернуть инстансы элементов, расположенных на DOM-нодах указанной jQuery-коллекции:

```javascript
this.elemInstances(domElem);
```

Для поиска одного (первого) BEM-инстанса элемента есть дополнительные формы этих хелперов с аналогичным API:

```javascript
// поиск одного вложенного элемента 'item'
this.findElemInstance('item');

// кэширующий поиск одного вложенного элемента 'item'
this.elemInstance('item');

// вернуть инстанс элемента, расположенного на первой DOM-ноде указанной jQuery-коллекции
this.elemInstance(domElem);
```

Если необходимо вернуть BEM-инстанс элемента, на DOM-ноде которого подмешаны другие элементы того же блока:

```javascript
this.elemInstance(this.elemify(domElem, 'item'));
```

### Поиск снаружи контекста

Существует хелпер для поиска элемента снаружи указанного контекста:

```javascript
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

По аналогии с хелперами ```elem``` и ```findElem```, хелпер ```closestElem``` возвращает jQuery-коллекцию. Для доступа к BEM-инстансам элементов снаружи контекста используются хелперы ```closestElemInstance``` и ```closestElemInstances```:

```javascript
// this => block 'menu'
this.closestElemInstance(this.elem('link'), 'item');
this.closestElemInstances(this.elem('link'), 'item');
```
```javascript
// this => element 'menu__link'
this.closestElemInstance('item');
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
Поэтому обработчики ```onSetMod``` элемента выполнятся, если родительский блок установит этому элементу соответствующие модификаторы:

```javascript
// this => element 'menu__item'
onSetMod: {
    'state': {
        'current': function() {
            // код обработчика
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
                // код обработчика
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