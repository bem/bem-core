bem-core changelog
==================
1.0.0
-----
- переход на модульную систему https://github.com/ymaps/modules
- все блоки-модули, кроме i-bem, избавились от префиксов
- из i-bem, i-bem__dom убраны все deprecated-методы
- i-bem больше не зависит от jQuery
- блок i-bem__dom становится модулем i-bem__dom. Все BEM.DOM-блоки должны теперь доопределять этот модуль. Пример: https://github.com/bem/bem-core/blob/feature/modules/common.bundles/index/blocks/b-square/b-square.js
- вместо BEM.afterCurrentEvent появился модуль next-tick. BEM.afterCurrentEvent теперь deprecated
- вместо BEM.channel появился отдельный модуль channels. BEM.channel теперь deprecated
- метод changeThis помечен как deprecated. Используйте нативный bind.
- $.observable становится модулем events и больше не зависит от jQuery
- $.inherit становится модулем inherit и больше не зависит от jQuery
- $.identify становится модулем identify и больше не зависит от jQuery
- $.throttle разбивается на два модуля: functions__throttle и functions__debounce, и больше не зависят от jQuery
- $.decodeURI, $.decodeURIComponent переезжают в модуль uri и больше не зависят от jQuery
- $.cookie становится модулем cookie и больше не зависит от jQuery
- блок i-system разбит на 2 модуля: idle и tick
- вместо метода destruct в i-bem появился зеркальный метод для onSetMod_js_inited: onSetMod_js_''
- поле, представляющее DOM-элемент блока в обработчике событий теперь доступно как e.domElem вместо e.data.domElem
- в метод findElem добавлен параметр, позволяющий находить элемента блока с учетом вложенных блоков
- добавлен модуль objects для работы с js-объектами (содержит методы extend, isEmpty, each)
- добавлен модуль для работы с функциями (содержит методы isFunction, noop)
- добавлен модуль для работы с промисами -- vow
- модуль inherit теперь поддерживает миксины
