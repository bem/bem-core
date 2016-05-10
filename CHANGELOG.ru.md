# История изменений

## 3.0.1

### В релиз вошли следующие исправления ошибок

- Исправлены pointer-события на iOS-устройствах ([#1253](https://github.com/bem/bem-core/issues/1253)).

## 3.0.0

### Изменения, ломающие обратную совместимость

- Удалены базовые шаблоны и документация для `BEMHTML` и `BEMTREE` ([#1258](https://github.com/bem/bem-core/issues/1258)). Следует использовать версию `bem-xjst` не ниже 6.3.0.
- Расширения файлов BEMHTML-шаблонов переименованы с `*.bemhtml` на `*.bemhtml.js` ([#984](https://github.com/bem/bem-core/issues/984)). Необходимо убедиться, что в конфиге сборки поддерживается новое расширение.
- Удален элемент `i-bem__i18n` ([#1304](https://github.com/bem/bem-core/issues/1304)). Для интернационализации следует использовать блок `i18n`.
- `jquery__events_type_pointerclick` больше не использует библиотеку [FastClick](https://github.com/ftlabs/fastclick) ([#1088](https://github.com/bem/bem-core/issues/1088)).

### Крупные изменения

- `jQuery` была обновлена до 2.2.3 и 1.12.3 ([#1260](https://github.com/bem/bem-core/issues/1260)).

### В релиз вошли следующие исправления ошибок

- В блоке `page` на уровне `blocks.touch` исправлена ошибка с невалидным значением `user-scalable=0` для `<meta name=viewport>` ([#1294](https://github.com/bem/bem-core/issues/1294)).
- Исправлена ошибка в `jquery__event_type_pointernative`, которая приводила к возникновению JS ошибки в IE8 ([1317](https://github.com/bem/bem-core/issues/1317)).

### Также в релиз вошли следующие изменения

- dist: Автоматическая инициализация блоков теперь опциональна ([#1271](https://github.com/bem/bem-core/issues/1271)).

## 2.9.0

### Крупные изменения

- `jQuery` была обновлена до 2.2.0 и 1.12.0 ([#1249](https://github.com/bem/bem-core/issues/1249)).

### В релиз вошли следующие исправления ошибок

- Исправлена ошибка в `BEMHTML 1.x`, которая приводила к потере `this.mods` в `reapply()` ([#97](https://github.com/bem/bem-xjst/issues/97)).

### Также в релиз вошли следующие изменения

- Теперь `jquery__event_type_pointerpressrelease` предоставляет `originalEvent` ([#1254](https://github.com/bem/bem-core/issues/1254)).
- dist: Поддержка `i18n` добавлена в dist ([#1212](https://github.com/bem/bem-core/issues/1212)).
- Шаблон `page__css.bemhtml` был обновлен для поддержки новых версий `bem-xjst` ([#1228](https://github.com/bem/bem-core/issues/1228)).

## 2.8.0

### Крупные изменения

- Реализован новый блок [i18n](https://github.com/bem/bem-core/tree/v2/common.blocks/i18n), реализующий интернационализацию проектов на bem-core ([#1074](https://github.com/bem/bem-core/issues/1074)).
- Теперь `jQuery` по умолчанию подключается через `https` ([#1202](https://github.com/bem/bem-core/issues/1202)).
- Удалена зависимость от `bemhtml-compat` ([#1186](https://github.com/bem/bem-core/issues/1186)). Пользователям `bem-tools` необходимо выполнить `npm i bemhtml-compat --save` для установки пакета на уровне проекта.

### В релиз вошли следующие исправления ошибок

- Исправлена ошибка в `loader_type_js`, допускавшая вызовы неопределенного обработчика ([#1159](https://github.com/bem/bem-core/pull/1159)).

### Также в релиз вошли следующие изменения

- BH-бандлы в `dist` теперь мимикрируют под BEMHTML ([#1210](https://github.com/bem/bem-core/issues/1210)).
- Улучшены шаблоны `bem create` для `bemhtml`, `bemtree`, `vanilla.js` и `browser.js` ([#1183](https://github.com/bem/bem-core/issues/1183)).
- `vow` обновлена до `0.4.10` ([#1056](https://github.com/bem/bem-core/issues/1056)).

## 2.7.0

### Крупные изменения

- В `i-bem__dom` добавлен новый метод `detach` ([#1102](https://github.com/bem/bem-core/issues/1102)).
- В `i-bem.bemhtml` добавлена поддержка вложенных миксов ([873](https://github.com/bem/bem-core/issues/873)).
- В `i-bem.bemhtml` добавлены незначительные оптимизации, связанные с эскейпингом аттрибутов ([#961](https://github.com/bem/bem-core/issues/961)), ([#980](https://github.com/bem/bem-core/issues/980)) и ([#982](https://github.com/bem/bem-core/issues/982)).
- В BEMHTML-шаблоны добавлена поддержка [bem-xjst](https://github.com/bem/bem-xjst) 2.x ([#1021](https://github.com/bem/bem-core/issues/1021)).
- `clearfix` оптимизирован для работы в поддерживаемых библиотекой браузерах IE ([#722](https://github.com/bem/bem-core/issues/722)).
- `jquery` обновлен до версий 2.1.4 и 1.11.3 ([#999](https://github.com/bem/bem-core/issues/999)).

### В релиз вошли следующие исправления ошибок

- Исправлена ошибка в `i-bem__dom`, из-за которой метод `findElem` не обновлял кэш ранее найденных
  элементов ([#583](https://github.com/bem/bem-core/issues/583)).
- Исправлена ошибка в `i-bem__dom`, приводящая к неправильной работе метода `dropElemCache` в некоторых граничных
  случаях ([#1037](https://github.com/bem/bem-core/issues/1037)).
- Исправлена ошибка в `i-bem__dom`, из-за которой вызов метода `setMod` не выставлял CSS-классы блоку в случае, если
  на DOM-узеле был подмешан блок с пересекающимся окончанием в имени ([#1090](https://github.com/bem/bem-core/issues/1090)).
- Исправлена ошибка в `page`, из-за которой на touch-уровнях не работало специализированное поле `zoom` ([#1020](https://github.com/bem/bem-core/issues/1020)).
- Исправлена ошибка в `keyboard__codes`. Клавиши `insert` и `delete` были описаны неправильными
  кодами ([#1002](https://github.com/bem/bem-core/issues/1002)).
- Исправлена ошибка в `i-bem.bemhtml`, из-за которой неверно интерпретировались вложенные вызовы `applyNext` ([b1dc50c](https://github.com/bem/bem-core/commit/b1dc50c621b5659cff33daa4dd3f210b67cf25e1)).
- Исправлена ошибка в `jquery__events_type_pointernative`, из-за которой события работали некорректно
  в браузерах IE 11 и Edge ([#1066](https://github.com/bem/bem-core/issues/1066)).

### Также в релиз вошли следующие изменения

- Обновлена русская докуметация для всех блоков библиотеки. Документация доступна по адресу https://ru.bem.info/libs/bem-core/.
- Прочие улучшения в документации к библиотеке.

## 2.6.0

### Крупные изменения

- Предоставление модуля `i-bem__dom` теперь происходит после наступления события DOM ready ([#859](https://github.com/bem/bem-core/issues/859)).
- Методы `setMod` и `hasMod` модуля `i-bem__dom` теперь явно преобразуют параметр `modVal` к строке,
  если переданное значение не типа string или boolean ([#890](https://github.com/bem/bem-core/issues/890)).
- В блок `page` добавлена возможность прокидывать атрибут `nonce`, для корректной работы инлайн-скриптов, в соответствии
  со спецификацией Content Security Policy ([#882](https://github.com/bem/bem-core/issues/882)).
- Добавлены шаблоны `page__conditional-comment` ([#551](https://github.com/bem/bem-core/issues/511)).
- Модуль `vow` обновлен до версии 0.4.8 ([#837](https://github.com/bem/bem-core/issues/837)).

### В релиз вошли следующие исправления ошибок

- Исправлена ошибка в `i-bem.bemhtml`, из-за которой CSS-класс блока дублировался, в случае микса с этим же блоком
  ([#792](https://github.com/bem/bem-core/issues/792)).
- Исправлена ошибка в `loader_type_bundle`, из-за которой функция-обработчик успешного результата могла выполняться
  после наступления таймаута ([67ff55f](https://github.com/bem/bem-core/commit/da5fdb9923e7e83e3ef9cd31aefc3967ff55fd3c)).
- Исправлена ошибка в `i-bem__dom`, в некоторых случаях, приводящая к неправильной интерпретации строковых аргументов
  в методах `append`, `prepend` и др. ([#852](https://github.com/bem/bem-core/issues/852)).
- Исправлена ошибка в `jquery__event_type_winresize`, из-за которой неправильно определятся браузер MSIE ([#862](https://github.com/bem/bem-core/issues/862)).
- Исправлена ошибка в `object`, из-за которой метод `extend` неправильно обрабатывал `null` в качестве значения
  аргумента `target` ([#910](https://github.com/bem/bem-core/issues/910)).
- Исправлена ошибка в `page`. Из BEMJSON было невозможно отключить добавление meta-тега `x-ua-compatible` ([#794](https://github.com/bem/bem-core/issues/794)).

### Также в релиз вошли следующие изменения

- Таймаут в `loader_type_bundle` увеличен до 30000 мс ([4e27422](https://github.com/bem/bem-core/commit/000c6af02bfae4506fa460168de16d4e27422393)).
- Исправлены незначительные ошибки в русской документации блоков.

## 2.5.1

### В релиз вошли следующие исправления ошибок

- Исправлена ошибка в `jquery__pointerpress` и `jquery__pointerrelease` из-за которой события не работали в браузере
  Internet Explorer 8 ([#792](https://github.com/bem/bem-core/issues/792)).
- Исправлена ошибка в `jquery__pointernative`. События `pointerenter` и `pointerleave` не должны всплывать
  по DOM-дереву ([#801](https://github.com/bem/bem-core/issues/801)).
- Исправлена ошибка в `loader_type_bundle`. После загрузки, CSS-бандл добавлялся в самый верх HTML-тега `<head>`, из-за чего
  CSS-правила из содержимого бандла могли работать не корректно ([#808](https://github.com/bem/bem-core/issues/808)).
- Исправлена ошибка в BH-шаблоне `ua`. Шаблон не позволял вставить содержимое блока из входного
  BEMJSON ([#734](https://github.com/bem/bem-core/pull/734)).
- Исправлена ошибка в `page`, приводящая к неработоспособности добавленных на страницу условных комментариев для браузера
  Internet Explorer ([#781](https://github.com/bem/bem-core/pull/781)).

### Также в релиз вошли следующие изменения

- `jquery` обновлен до версий 2.1.3 и 1.11.2 ([#778](https://github.com/bem/bem-core/pull/788)).
- Добавлена документация на русском языке для модулей: `clearfix`, `cookie`, `identify`, `idle`, `inherit`, `keyboard`,
`loader`, `next-tick`, `string` and `tick`.
- Исправлена документация на русском языке для `i-bem.js`.
- Обновлено руководство на английском языке по технологиям BEMHTML и BEMJSON.

## 2.5.0

### Крупные изменения

- Код библиотеки переведен на использование лицензии [MPL 2.0](https://www.mozilla.org/MPL/2.0/) ([#443](https://github.com/bem/bem-core/issues/443)).
- В модуль `loader_type_js` добавлена возможность указывать функцию-обработчик ошибок ([#672](https://github.com/bem/bem-core/issues/672)).
- Класс `BEMContext` добавлен в export-параметры функции `oninit` в базовых шаблонах `i-bem.bemtree` ([#602](https://github.com/bem/bem-core/issues/602)).
- В `BEMContext` BEMTREE добавлен статический метод `reapply` по аналогии с BEMHTML ([#706](https://github.com/bem/bem-core/pull/706)).
- Добавлены bh-шаблоны блока `page` для уровней touch ([#689](https://github.com/bem/bem-core/pull/689)).
- npm-модуль [bem-xjst](https://github.com/bem/bem-xjst) обновлен до версии 0.9.0 ([#709](https://github.com/bem/bem-core/pull/709)).

### В релиз вошли следующие исправления ошибок

- Исправлена ошибка в `i-bem__dom`, из-за которой метод `findBlocksInside` мог возвращать блоки, которые еще не были
  инициализированы ([#699](https://github.com/bem/bem-core/issues/699)).
- Исправлена ошибка в `tick`, позволявшая вызвать метод `stop` без освобождения внутреннего таймера ([#694](https://github.com/bem/bem-core/issues/694)).
- Исправлена ошибка в `i-bem.bemhtml`, из-за которой на элементы блока добавлялся CSS-класс `i-bem` ([#633](https://github.com/bem/bem-core/issues/633)).
- Исправлена ошибка в технологии `html-from-bemtree`, из-за которой в контексте BEMTREE-шаблонов не было глобальных объектов
  `vow`, `console`, `setTimeout` ([#438ebb8](https://github.com/bem/bem-core/commit/438ebb8f828e26977592e26511e8aad15176d7a4)).

### Также в релиз вошли следующие изменения

- Добавлено английское руководство по технологии BEMJSON.
- Обновлена русская документация для i-bem.js. Теперь документация соответсвует текущему API библиотеки.
- Обновлена документация для технологий BEMHTML/BEMTREE.

## 2.4.0

### Крупные изменения

- npm-модуль [bem-xjst](https://github.com/bem/bem-xjst) обновлен до версии 0.8.0; [bemhtml-compat](https://github.com/bem/bemhtml-compat)
  обновлен до 0.0.11.

### В релиз вошли следующие исправления ошибок

- Исправлена ошибка в `jquery__event_type_pointerpressrelease`, из-за которой события `pointerpress` / `pointerrelease` генерировались
  на нажатие любой кнопки мыши ([#607](https://github.com/bem/bem-core/issues/607)).
- Исправлена ошибка в `i-bem__dom.js`, из-за которой в некоторых случаях не происходил вызов базового метода
  `live` ([#608](https://github.com/bem/bem-core/issues/608)).

### Также в релиз вошли следующие изменения

- Добавлена английская документация на JS-синтаксис BEMHTML.

## 2.3.0

### Крупные изменения

- Добавлена новая реализация pointer-событий на основе полифилов из [Polymer](http://www.polymer-project.org/) ([#567](https://github.com/bem/bem-core/pull/567)).
- Добавлена возможность в `i-bem__dom.js` указывать дополнительные данные о событии в методах `bindTo*` ([#568](https://github.com/bem/bem-core/issues/568)).

### В релиз вошли следующие исправления ошибок

- Исправлена ошибка в `i-bem.bemhtml`, из-за которой было невозможно использовать микс в виде одного объекта (не массива) одновременно в BEMJSON и BEMHTML ([#555](https://github.com/bem/bem-core/issues/555)).
- Исправлена ошибка в BEMHTML-шаблоне блока `page`, из-за которой не выполнялись стандартные моды, и исправлена регрессия в шаблоне на touch-уровне ([516](https://github.com/bem/bem-core/issues/516)).

## 2.2.4

### В релиз вошли следующие исправления ошибок

- Исправлена ошибка в `i-bem.js`, из-за которой событие об изменении модификатора генерировалось,
  даже если обработчик `beforeSetMod` предотвращал изменение ([#546](https://github.com/bem/bem-core/pull/546)).
- В случае возникновения ошибки в процессе декодирования строки, модуль `querystring__uri` теперь возвращает
  оригинальную строку ([#554](https://github.com/bem/bem-core/pull/554)).

## 2.2.3

### В релиз вошли следующие исправления ошибок

- В модуле `i-bem__dom` был исправлен процесс удаления блока для предотвращения нежелательной повторной
  инициализации блока ([#540](https://github.com/bem/bem-core/issues/540)).
- Исправлена ошибка в модуле `jquery__event_type_pointer`, из-за которой нативные события мыши ошибочно замещались
  на pointer-события ([#534](https://github.com/bem/bem-core/issues/534)).
- `unbindFrom*`-методы в модуле `i-bem__dom` теперь поддерживают отписывание от нескольких событий
  за вызов ([#533](https://github.com/bem/bem-core/issues/533)).
- Добавлена недостающая зависимость от модуля `functions` в модуле `events` ([#532](https://github.com/bem/bem-core/issues/532)).

## 2.2.2

### В релиз вошли следующие исправления ошибок

- Исправлена ошибка в модуле `i-bem__dom` приводящая к повторной инициализации блока на DOM-узле, отмеченном как
  удаленный ([#518](https://github.com/bem/bem-core/issues/518)).
- Исправлена ошибка в модуле `i-bem`, из-за которой невозможно было подписаться на событие о выставлении модификатора в
  значение `false` ([#529](https://github.com/bem/bem-core/issues/529)).
- Модуль `jquery` обновлен до версий 2.1.1 и 1.11.1 ([#515](https://github.com/bem/bem-core/issues/515)).

## 2.2.1

- Исправлена ошибка в модуле `jquery__event_type_pointerpressrelease`, из-за которой событие `pointerpress` генерировалось
  дважды на каждое событие `mousedown` в IE10 ([#505](https://github.com/bem/bem-core/issues/505)).

## 2.2.0

### Крупные изменения

- Добавлен новый модуль `keyboard__codes` ([#431](https://github.com/bem/bem-core/issues/431)).
- Класс `BEMContext` добавлен в export-параметры функции `oninit` в базовых шаблонах `i-bem.bemhtml` ([#485](https://github.com/bem/bem-core/pull/485)).
- Добавлена возможность декларировать инстанс элемента используя класс блока ([#481](https://github.com/bem/bem-core/issues/481)).
- Исправлено поведение метода `isSimple` класса BEMContext в  в базовых шаблонах `i-bem.bemhtml` ([#432](https://github.com/bem/bem-core/pull/432)).
- Исправлена ошибка в методе `liveUnbindFrom` модуля `BEMDOM` ([#476](https://github.com/bem/bem-core/pull/476)).
- Исправлена ошибка в методе `isFocusable` модуля `dom`, возникающая если переданный `domElem` является ссылкой
  с атрибутом `tabindex`, но без атрибута `href` ([#501](https://github.com/bem/bem-core/issues/501)).
- Исправлена ошибка возникающая в процессе декларации БЭМ-блока как модуля, если был подключен
  модуль `i-bem__dom_elem-instances` ([#479](https://github.com/bem/bem-core/issues/479)).
- В модуле `i-bem__dom_init_auto` добавлено временное решение для проблем с производительностью ренедеринга при инициализации блоков
  в Chrome-браузерах ([#486](https://github.com/bem/bem-core/issues/486)).
- Модуль `vow.js` перенесен в `vow.vanilla.js` ([#412](https://github.com/bem/bem-core/issues/412)).

### Также в релиз вошли следующие изменения

- Модуль `vow` обновлен до версии 0.4.3 ([#504](https://github.com/bem/bem-core/pull/504)).
- Добавлена русская документация на технологию BEMTREE ([#500](https://github.com/bem/bem-core/pull/500)).
- Обновлена русская документация на JavaScript-синтаксис BEMHTML ([#471](https://github.com/bem/bem-core/pull/471)).
- Добавлен референс на API JavaScript-модулей. См. ветку `v2-jsdoc` ([#478](https://github.com/bem/bem-core/pull/478)).

## 2.1.0

### Крупные изменения

- Исправлена ошибка в `i-bem.js`, из-за которой событие об изменении модификатора происходило до того, как будет
  вызван обработчик реакции на изменение этого модификатора в `onSetMod` ([#454](https://github.com/bem/bem-core/issues/454)).
- Свойства `this.mods` и `this.ctx.mods` базового шаблона `i-bem.bemhtml` теперь используют
  один и тот же объект ([#441](https://github.com/bem/bem-core/issues/441)).
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
- jQuery больше не удаляет себя из глобальной области видимости, если присутствует на странице ([#349](https://github.com/bem/bem-core/issues/349)).
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
