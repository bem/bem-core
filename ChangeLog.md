# История изменений

## 1.0.0

- Переход на модульную систему https://github.com/ymaps/modules.
- Все блоки-модули, кроме `i-bem`, избавились от префиксов.
- Из `i-bem`, `i-bem__dom` убраны все deprecated-методы.
- `i-bem` больше не зависит от jQuery.
- Блок `i-bem__dom` становится модулем `i-bem__dom`. Все BEM.DOM-блоки должны теперь доопределять этот модуль ([пример](common.bundles/index/blocks/b-square/b-square.js)).
- Вместо `BEM.afterCurrentEvent` появился модуль `next-tick`. `BEM.afterCurrentEvent` теперь **deprecated**.
- Вместо `BEM.channel` появился отдельный модуль `channels`. `BEM.channel` теперь **deprecated**.
- Метод `changeThis` помечен как **deprecated**. Используйте нативный `bind`.
- `$.observable` становится модулем `events` и больше не зависит от jQuery.
- `$.inherit` становится модулем `inherit` и больше не зависит от jQuery.
- `$.identify` становится модулем `identify` и больше не зависит от jQuery.
- `$.throttle` разбивается на два модуля: `functions__throttle` и `functions__debounce`, и больше не зависят от jQuery.
- `$.decodeURI`, `$.decodeURIComponent` переезжают в модуль `uri` и больше не зависят от jQuery.
- `$.cookie` становится модулем `cookie` и больше не зависит от jQuery.
- Блок `i-system` разбит на 2 модуля: `idle` и `tick`.
- Вместо метода `destruct` в `i-bem` появился зеркальный метод для `onSetMod: { js : { inited : ... } } }` — `{ onSetMod : { js : { '' : ... } } }`.
- Поле, представляющее DOM-элемент блока в обработчике событий теперь доступно как `e.domElem` вместо `e.data.domElem`.
- В метод `findElem` добавлен параметр, позволяющий находить элемента блока с учетом вложенных блоков.
- Добавлен модуль `objects` для работы с js-объектами (содержит методы `extend`, `isEmpty`, `each`).
- Добавлен модуль для работы с функциями (содержит методы `isFunction`, `noop`).
- Добавлен модуль для работы с промисами — `vow`.
- Модуль `inherit` теперь поддерживает миксины.
