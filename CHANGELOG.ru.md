# История изменений

## 2.1.0

### Крупные изменения

- Исправлена ошибка в `i-bem.js`, из-за которой событие об изменении модификатора происходило до того, как будет
  вызван обработчик реакции на изменение этого модификатора в `onSetMod` ([#454](https://github.com/bem/bem-core/issues/454)).
- Свойства `this.mods` и `this.ctx.mods` базового шаблона `i-bem.bemhtml` теперь используют один и тот же объект ([#441](https://github.com/bem/bem-core/issues/441)).
- Модуль [inherit](https://github.com/dfilatov/inherit) обновлен до версии 2.2.1 ([#466](https://github.com/bem/bem-core/issues/466)).
- Исправлен порядок тегов секции `head` в шаблоне `page.bemhtml` ([#465](https://github.com/bem/bem-core/pull/465)).

### Также в релиз вошли следующие изменения

- В русскую документацию к `i-bem.js` добавлено описание поля `baseMix` ([#461](https://github.com/bem/bem-core/pull/461)).
- CDN-хост внешних ресурсов изменен на `yastatic.net` ([#444](https://github.com/bem/bem-core/issues/444)).
  Все ресурсы все так же доступны с хоста `yandex.st`. Физически `yandex.st` и `yastatic.net` находятся на
  одних и тех же серверах. Различие только в DNS-записях.
- Добавлен базовый BEMHTML-шаблон для команды `bem create` технологии `bemhtml` ([#277](https://github.com/bem/bem-core/issues/277)).
- Прекращен автоматический запуск тестов под Node.js 0.8 в [Travis CI](http://travis-ci.com) ([#455](https://github.com/bem/bem-core/issues/455)).
- Иконка статуса автосборки Travis [заменена на SVG](http://blog.travis-ci.com/2014-03-20-build-status-badges-support-svg/) :)

## 2.0.0

### Изменения, ломающие обратную совместимость

- Из `i-bem.js` и `i-bem__dom.js` удалены все **deprecated** методы ([#318](https://github.com/bem/bem-core/issues/318)):

  * `destruct`, используйте `onSetMod js ''`;
  * `extractParams`, используйте `elemParams`;
  * `trigger`, используйте `emit`;
  * `afterCurrentEvent`, используйте модуль `next-tick`;
  * `channel`, используйте модуль `events__channels`;
  * `changeThis`, используйте нативный `Function.prototype.bind`.

- Из `i-bem.js` убраны события `init` и `destruct`. Вместо них следует использовать события об изменении модификатора
  (см. «Крупные изменения»).
- Блок `ecma` перенесен [в отдельный репозиторий](http://github.com/bem/es5-shims); ES5-shims следует использовать
  для IE < 9 ([#230](https://github.com/bem/bem-core/issues/230)).
- Модуль `vow` обновлен до мажорной версии 0.4.1 ([#350](https://github.com/bem/bem-core/issues/350)).
  См. [изменения в Vow](https://github.com/dfilatov/vow/blob/0.4.1/CHANGELOG.md).
- В `i-bem.bemhtml` добавлена поддержка vow@0.4 ([#385](https://github.com/bem/bem-core/issues/385)).

### Крупные изменения

- Добавлена возможность декларировать BEMDOM-блоки как модули [ym](https://github.com/ymaps/modules) ([#382](https://github.com/bem/bem-core/issues/382)).
- В `i-bem.js` добавлены события об изменении модификатора ([#357](https://github.com/bem/bem-core/issues/357)).
- Добавлена поддержка использования строковых значений в качестве аргумента в методах `BEMDOM.init` ([#419](https://github.com/bem/bem-core/issues/419))
  и `BEMDOM.update` ([#420](https://github.com/bem/bem-core/issues/420)).
- Методы `i-bem__dom.js` `replace`, `append`, `prepend`, `before`, `after` теперь возвращают новый контекст,
  а `update` – изменённый ([#410](https://github.com/bem/bem-core/issues/410)).
- В `loader` добавлен модификатор `_type_bundle` ([#358](https://github.com/bem/bem-core/issues/358)).
- jQuery обновлен до версии 2.1.0. Для IE < 9 — до версии 1.11.0 ([#356](https://github.com/bem/bem-core/issues/356)).

### Также в релиз вошли следующие изменения

- Базовые шаблоны в `i-bem.bemhtml` используют конкатенацию строк вместо наполнения внутреннего буфера ([#401](https://github.com/bem/bem-core/issues/401)).
- jQuery больше не удаляет себя из глобавльной области видимости, если присутствует на странице ([#349](https://github.com/bem/bem-core/issues/349)).
- `jquery__event_type_pointerclick.js` перемещен с уровня `touch.blocks` на уровень `common.blocks` ([#393](https://github.com/bem/bem-core/issues/393)).
- Модификаторы `i-bem_elem-instances_yes` и `i-bem__dom_elem-instances_yes` приведены к булевому стилю ([#352](https://github.com/bem/bem-core/issues/352)).
- Исправлена ошибка в шаблоне блока `page`, возникающая при использовании development-режима BEMHTML ([#417](https://github.com/bem/bem-core/issues/417)).
- Для поддержки Android 2.3 внутри `i-bem.js` отказались от использований `Function.prototype.bind` ([#404](https://github.com/bem/bem-core/issues/404)).
- Исправлены ошибки в модуле технологии `browser-js+bemhtml` ([#392](https://github.com/bem/bem-core/issues/392)).
- NPM-модуль `ym` обновлен до версии [0.0.15](https://github.com/ymaps/modules/releases) ([#414](https://github.com/bem/bem-core/issues/414)).

## 1.2.0

### Крупные изменения

- BEM-блоки инициируют событие `destruct` в процессе удаления ([#370](https://github.com/bem/bem-core/issues/370)).
- Исправлены полифилы для `pointerevents` ([#354](https://github.com/bem/bem-core/pull/354)).

### Также в релиз вошли следующие изменения

- JSDoc блоков исправлен в соответствии с поддержкой [bem-jsd](github.com/bem/bem-jsd) ([#335](https://github.com/bem/bem-core/issues/335)).
- Референс на BEMHTML обновлен для соответствия JavaScript-синтаксису шаблонизатора ([#355](https://github.com/bem/bem-core/pull/355)).
- Переход на менеджер зависимостей [bower](http://bower.io) ([#367](https://github.com/bem/bem-core/issues/367)).

## 1.1.0

### Крупные изменения

- Для современных браузеров `jquery__config` подключает jQuery 2.x ([#319](https://github.com/bem/bem-core/issues/319)).
- Добавлена возможность использовать произвольный BEMJSON в качестве значения атрибутов в BEMHTML ([#290](https://github.com/bem/bem-core/issues/290)).
- Исправлены зависимости в `i-bem__collection` ([#292](https://github.com/bem/bem-core/issues/292)).
- Удалены CSS-стили блока `page` из уровня `touch.blocks` ([#306](https://github.com/bem/bem-core/issues/306)).
- Исправлена ошибка в BEMHTML-шаблоне блока `page`, приводящая к зацикливанию шаблонизатора
  в production-режиме ([#309](https://github.com/bem/bem-core/issues/309)).
- Исправлена возможная ошибка в `next-tick`, возникающая при вставке скрипта в DOM в IE<9 ([#324](https://github.com/bem/bem-core/issues/324)).
- Исправлена ошибка в инициализации плагина `FastClick` в модуле `jquery__event_type_pointerclick`
  на уровне `touch.blocks` ([#332](https://github.com/bem/bem-core/issues/332)).
- Исправлена ошибка в технологии `node.js` в Windows ([#274](https://github.com/bem/bem-core/issues/274)).
- Исправлена ошибка в `onElemSetMod` в `i-bem__dom_elem-instances` ([#340](https://github.com/bem/bem-core/issues/340)).
- В технологии `bemhtml` используется [bem-xjst](https://github.com/bem/bem-xjst) ([#329](https://github.com/bem/bem-core/issues/329)).

### Также в релиз вошли следующие изменения

- Модуль [ym](https://github.com/ymaps/modules) обновлен до версии 0.0.12 ([#326](https://github.com/bem/bem-core/issues/326)).
- В ядре локализации `i-bem__i18n` отключен вывод сообщений о неизвестных ключах, если не включен
  debug-режим ([#285](https://github.com/bem/bem-core/issues/285)).
- Инфраструктура сборки тестов и примеров переведена
  на [bem-pr@v0.5.x](https://github.com/narqo/bem-pr/blob/0.5.3/HISTORY.md) ([#323](https://github.com/bem/bem-core/issues/323)).
- Исправлен jsdoc для метода `dropElemCache()` в `i-bem__dom` ([#296](https://github.com/bem/bem-core/issues/296)).
- Доработана документация для блока `i-bem.js` на русском языке.
- В README проекта добавлен [список поддерживаемых браузеров](https://github.com/bem/bem-core/blob/v1/README.ru.md#%D0%9F%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%B8%D0%B2%D0%B0%D0%B5%D0%BC%D1%8B%D0%B5-%D0%B1%D1%80%D0%B0%D1%83%D0%B7%D0%B5%D1%80%D1%8B).

## 1.0.0

### Крупные изменения

- Переход на модульную систему [ym](https://github.com/ymaps/modules).
- Из `i-bem`, `i-bem__dom` убраны все deprecated-методы.
- `i-bem` больше не зависит от jQuery. `i-bem__dom` продолжает зависеть от jQuery.
- BEMHTML-шаблоны можно писать с использованием [JS-синтаксиса](https://gist.github.com/veged/6150760).
- Новая технология `bemtree` (на базе [bem-xjst](https://github.com/bem/bem-xjst)) для описания процесса
  динамического построения БЭМ-дерева.
- Новая технология `vanilla.js` для описания JS-реализации модулей, не зависящей от конкретного JavaScript движка.
- Новые технологии `browser.js` и `node.js` для описания JS-реализаций модулей (блоков) в соответствующих движках.
  Для совместимости с существующим кодом считаем, что файлы с расширением `.js` содержат реализацию блоков
  в технологии `browser.js`.
- Система модульного тестирования и примеров для блоков в библиотеке.
- Появились полифилы (`jquery__event_type_pointer` и `jquery__event_type_pointerclick` как jQuery-плагины),
  позволяющие использовать универсальные события для десктопных и тач-интерфейсов.
- Плагин для jQuery, позволяющий навешивать обработчик события на нажатие левой кнопки мыши, становится модулем `jquery__pointerclick`.
- В `i-bem` и BEMHTML добавлена поддержка простых модификаторов (модификаторов без значений).

### Также в релиз вошли следующие изменения

- Все блоки-модули, кроме `i-bem`, избавились от префиксов.
- Блок `i-bem__dom` становится модулем `i-bem__dom`. Все BEM.DOM-блоки должны теперь доопределять
  этот модуль ([пример](https://github.com/bem/bem-core/blob/v1/common.bundles/index/blocks/b-square/b-square.js)).
- Метод для декларации блоков (`.decl()`) больше не принимает первым параметром объект с полем `name`.
  Теперь обязательная форма записи с полем `block`: `BEM.decl({ block: 'b1', modName: 'm', modVal: 'v' }, ...)`.
- Вместо метода `afterCurrentEvent` у блоков появился метод `nextTick`, который проверят существование блока в момент исполнения колбэка. `BEM.afterCurrentEvent` теперь **deprecated**.
- Вместо `BEM.channel` появился отдельный модуль `channels`. `BEM.channel` теперь **deprecated**.
- Метод `changeThis` помечен как **deprecated**. Используйте нативный `bind`.
- Метод `del` удален из блока `i-bem`.
- Метод `getWindowSize` удален из блока `i-bem__dom`. Используйте `BEMDOM.win.width()` и `BEMDOM.win.height()`.
- Добавлен модуль-обертка `jquery`, предоставляющий jQuery. Модуль либо предоставляет jQuery, уже присутствующий на странице, либо сам его загружает (версию 1.10.1).
- `$.observable` становится модулем `events` и больше не зависит от jQuery.
- `$.inherit` становится модулем `inherit` и больше не зависит от jQuery.
- `$.identify` становится модулем `identify` и больше не зависит от jQuery.
- `$.throttle` разбивается на два модуля: `functions__throttle` и `functions__debounce`, которые больше не зависят от jQuery.
- `$.decodeURI`, `$.decodeURIComponent` переезжают в модуль `querystring__uri` и больше не зависят от jQuery.
- `$.cookie` становится модулем `cookie` и больше не зависит от jQuery.
- Вместо `$.browser` появился модуль `ua` с аналогичным интерфейсом.
- Блок `i-system` разбит на 2 модуля: `idle` и `tick`.
- Вместо события `leftclick` следует использовать `pointerclick` (предоставляемый полифилом `jquery__event_type_pointerclick`).
- Триггеры на установку модификаторов теперь разделены на две группы: до установки модификатора (`beforeSetMod` и `beforeElemSetMod`) и после (`onSetMod` и `onElemSetMod`). Отмена установки модификатора теперь возможна только из триггеров первой группы.
- Использовать конструкцию `{ onSetMod : { js : function() { ... } } }` в качестве конструктора теперь **deprecated**, необходимо использовать `onSetMod: { js : { inited : ... } } }`.
- Вместо метода `destruct` в `i-bem` появился зеркальный метод
  для `onSetMod: { js : { inited : ... } } }` — `{ onSetMod : { js : { '' : ... } } }`.
  Метод `destruct` теперь **deprecated**.
- Метод `exractParams` в `i-bem__dom` теперь **deprecated**, для доступа к параметрам элементов нужно использовать метод `elemParams`.
- Метод `trigger` в `i-bem` теперь **deprecated**, нужно использовать `emit`.
- Метод `onFirst` в `i-bem` теперь **deprecated**, нужно использовать `once`.
- Удалено **deprecated** поле `e.block`, представляющее блок-источник события для BEM-событий. Вместо него следует использовать поле `e.target`.
- Для доступа к DOM-элементу блока в обработчике DOM-событий теперь нужно использовать поле `currentTarget`, предоставляемое jQuery. Вместо `e.data.domElem`нужно писать `$(e.currentTarget)`.
- В методе `findElem` добавлен параметр, позволяющий находить элемента блока с учетом вложенных блоков.
- Добавлена возможность указывать конкретную функцию для отписки от событий в методах `unbindFrom*`.
- Добавлен модуль `objects` для работы с JS-объектами (содержит методы `extend`, `isEmpty`, `each`).
- Добавлен модуль `functions` для работы с JS-функциями (содержит методы `isFunction`, `noop`).
- Добавлен модуль `dom` для хелперов при работе с DOM.
- Добавлен модуль `querystring` для работы с урлами.
- Добавлен модуль `loader_type_js` для загрузки JS.
- Добавлен модуль `vow` для работы с промисами.
- Добавлен модуль `next-tick` для полифила `nextTick`, `setImmediate`, `setTimeout(0, ...` и т.п..
- Добавлен модуль `strings__escape`, содержащий методы для эскейпинга XML, HTML и атрибутов.
- Модуль `inherit` теперь поддерживает миксины.
- В модуле `functions__throttle` добавлен параметр `invokeAsap`, позволяющий отложить первое исполнение.
