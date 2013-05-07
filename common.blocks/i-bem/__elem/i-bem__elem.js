(function(BEM, $, undefined) {

var INTERNAL = BEM.INTERNAL,
    buildClass = INTERNAL.buildClass,
    NAME_PATTERN = INTERNAL.NAME_PATTERN,
    MOD_DELIM = INTERNAL.MOD_DELIM,
    ELEM_DELIM = INTERNAL.ELEM_DELIM;

/**
 * Очищает кэш модификаторов элемента
 */
function clearElemModCache() {
    var result = this.__base.apply(this, arguments);
    this.__self._elemName && (this._modCache = {});
    return result;
}

BEM.decl('i-bem__dom', {

    getMod : clearElemModCache,
    getMods : clearElemModCache,
    setMod : clearElemModCache,

    /**
     * Находит элементы блока снаружи указанного контекста
     * Находит элементы родительского блока снаружи текущего элемента или указанного контекста
     * @param {jQuery} [ctx=this.domElem] элемент, снаружи которого проходит поиск (текущий элемент)
     * @param {String} elemName имя элемента
     * @returns {jQuery} DOM-элементы
     */
    closestElem : function(ctx, elemName) {

        if (!elemName) {
            elemName = ctx;
            ctx = this.domElem;
        }

        return ctx.closest(this.buildSelector(elemName));

    },

    /**
     * Возвращает и, при необходимости, инициализирует родительский блок
     * @returns {BEM}
     */
    getParent : function() {

        return this._parent || (this._parent = this.findBlockOutside(this.__self._blockName));

    },

    /**
     * Находит элементы родительского блока, вложенные в текущий элемент
     * @protected
     * @param {String} names имя (или через пробел имена) элемента родительского блока
     * @param {String} [modName] имя модификатора
     * @param {String} [modVal] значение модификатора
     * @returns {jQuery} DOM-элементы
     */
    findElem : function() {

        var domElem = this.domElem,
            selector = this.buildSelector(''),
            result = this._findElem.apply(this, arguments),
            some = Array.prototype.some;

        if (domElem.find(selector).length) {
            this.__self._elemName && (domElem = domElem.closest(selector));

            result = result.filter(function() {
                var closest = $(this).closest(selector)[0];
                return some.call(domElem, function(item) {
                    return item === closest;
                });
            });
        }

        return result;

    },

    // полностью переопределяем нативный хелпер
    _findElem : function(ctx, names, modName, modVal) {

        if(arguments.length % 2) {
            modVal = modName;
            modName = names;
            names = ctx;
            ctx = this.domElem;
        } else if(typeof ctx == 'string') {
            ctx = this.findElem(ctx);
        }

        var _self = this.__self,
            selector = '.' +
                names.split(' ').map(function(name) {
                    return _self.buildClass(name, modName, modVal);  // все ради этой строчки :-(
                }).join(',.');
        return ctx.find(selector).add(ctx.filter(selector)); // findDomElem

    },

    /**
     * Выполняет обработчики установки модификаторов
     * При установке модификатора элементам, выполняет также их обработчики onSetMod (при наличии у этих элементов собственных инстансов)
     * При установке элементом модификатора самому себе, выполняет также обработчики onElemSetMod родительского блока
     * @private
     * @param {String} elemName имя элемента
     * @param {String} modName имя модификатора
     * @param {String} modVal значение модификатора
     * @param {Array} modFnParams параметры обработчика
     */
    _callModFn : function(elemName, modName, modVal, modFnParams) {

        var result = this.__base.apply(this, arguments),
            elemClass;

        if (this.__self._elemName) {

            this.__base.call(
                this.getParent(),
                this.__self._elemName,
                modName,
                modVal,
                [ this.domElem ].concat(modFnParams)
            )
                === false && (result = false);

        } else if (elemName && BEM.blocks[elemClass = this.__self.buildClass(elemName)]) {

            this.findBlocksOn(modFnParams[0], elemClass).forEach(
                function(elemInstance) {
                    this.__base.call(
                        elemInstance,
                        undefined,
                        modName,
                        modVal,
                        modFnParams.slice(1)
                    )
                        === false && (result = false) },
                this);

        }

        return result;

    },

    /**
     * Находит (возвращает) первый инстанс указанного элемента текущего (или родительского) блока
     * @param {String|jQuery} elem имя элемента или jQuery-коллекция
     * @param {String} [modName] имя модификатора (только если первый параметр типа String)
     * @param {String} [modVal] значение модификатора (только если первый параметр типа String)
     * @returns {BEM}
     */
    elemInstance : function() {

        return this.elemInstances.apply(this, arguments)[0] || null;

    },

    /**
     * Находит (возвращает) инстансы указанных элементов текущего (или родительского) блока
     * @param {String|jQuery} elem имя элемента или jQuery-коллекция
     * @param {String} [modName] имя модификатора (только если первый параметр типа String)
     * @param {String} [modVal] значение модификатора (только если первый параметр типа String)
     * @returns {BEM[]}
     */
    elemInstances : function(elem) {

        var _self = this.__self,
            blockName = _self._blockName,
            elemClass;

        if (typeof elem == 'string') {
            elemClass = buildClass(blockName, elem = elem.replace(/^.+__/, ''));
            elem = this.findElem.apply(this, [elem].concat($.makeArray(arguments).slice(1)));
        } else {
            elemClass = buildClass(blockName, _self._extractElemNameFrom(elem));
        }

        return this.findBlocksOn(elem, elemClass);

    },

    /**
     * Строит CSS-селектор, соответствующий блоку/элементу и модификатору
     * @param {String} [elem] имя элемент
     * @param {String} [modName] имя модификатора
     * @param {String} [modVal] значение модификатора
     * @returns {String}
     */
    buildSelector : function() {

        return this.__self.buildSelector.apply(this.__self, arguments);

    }

}, {

    /**
     * Декларатор элементов, создает класс элемента
     * @static
     * @protected
     * @param {Object} decl описание элемента
     * @param {String} decl.block имя блока
     * @param {String} decl.elem имя элемента
     * @param {Object} [props] методы
     * @param {Object} [staticProps] статические методы
     */
    decl : function(decl, props, staticProps) {

        var block;

        if (decl.elem) {
            block = this.__base(
                {
                    block: buildClass(decl.block, decl.elem),
                    modName: decl.modName,
                    modVal: decl.modVal
                },
                props,
                staticProps);
            block._blockName = decl.block;
            block._elemName = decl.elem;
        } else {
            block = this.__base.apply(this, arguments);
            block._blockName = block._name;
        }

        return block;

    },

    /**
     * Хелпер для live-инициализации по событию другого блока снаружи текущего
     * @static
     * @protected
     * @param {String} event имя события
     * @param {String} blockName имя блока, на инициализацию которого нужно реагировать
     * @param {Function} [callback] обработчик, вызываемый после успешной инициализации в контексте нового блока
     */
    liveInitOnBlockOutsideEvent : function(event, blockName, callback) {

        return this._liveInitOnBlockEvent(event, blockName, callback, 'findBlocksInside');

    },

    /**
     * Хелпер для live-инициализации по событию родительского блока
     * @static
     * @protected
     * @param {String} event имя события
     * @param {Function} [callback] обработчик, вызываемый после успешной инициализации в контексте нового элемента
     */
    liveInitOnParentEvent : function(event, callback) {

        return this._liveInitOnBlockEvent(event, this._blockName, callback, 'elemInstances');

    },

    /**
     * Строит CSS-класс, соответствующий блоку/элементу и модификатору
     * @param {String} [elem] имя элемент
     * @param {String} [modName] имя модификатора
     * @param {String} [modVal] значение модификатора
     * @returns {String}
     */
    buildClass : function(elem, modName, modVal) {

        return this._elemName && (arguments.length % 2)?
            buildClass(this._blockName, elem, modName, modVal):
            buildClass(this._name, elem, modName, modVal);

    },

    /**
     * Строит CSS-селектор, соответствующий блоку/элементу и модификатору
     * @param {String} [elem] имя элемент
     * @param {String} [modName] имя модификатора
     * @param {String} [modVal] значение модификатора
     * @returns {String}
     */
    buildSelector : function() {

        return '.' + this.buildClass.apply(this, arguments);

    },

    /**
     * Строит префикс для CSS-класса DOM-элемента или вложенного элемента блока по имени модификатора
     * @static
     * @private
     * @param {String} modName имя модификатора
     * @param {jQuery|String} [elem] элемент
     * @returns {String}
     */
    _buildModClassPrefix : function(modName, elem) {

        return buildClass(elem? this._blockName: this._name) +
               (elem?
                   ELEM_DELIM + (typeof elem === 'string'? elem : this._extractElemNameFrom(elem)) :
                   '') +
               MOD_DELIM + modName + MOD_DELIM;

    },

    /**
     * Строит регулярное выражение для извлечения имени вложенного в блок элемента
     * @static
     * @private
     * @returns {RegExp}
     */
    _buildElemNameRE : function() {

        return new RegExp(this._blockName + ELEM_DELIM + '(' + NAME_PATTERN + ')(?:\\s|$)');

    },

    /**
     * Возвращает имя текущего инстанса (блок: 'b-block', элемент: 'b-block__elem')
     * @static
     * @protected
     * @param {Boolean} shortName вернуть короткое имя текущей сущности (блок: 'b-block', элемент: 'elem')
     * @returns {String}
     */
    getName : function(shortName) {

        return shortName? (this._elemName || this._blockName): this._name;

    }

});

})(BEM, jQuery);
