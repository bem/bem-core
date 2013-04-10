/**
 * The block's BEM declaration can state which block (a block with a modifier or a block
 * with a specific modifier value)
 * a given JavaScript component refers to.
 *
 * You can find various declarations on the i-bem block's wiki page, blocks/i-bem/i-bem.wiki
 */

modules.define('i-bem.dom', function(provide, DOM) {

provide(DOM.decl('b-square', {

    onSetMod : {
        'js' : {
            'inited' : function() {
                console.log('inited');
            },

            '' : function() {
                console.log('destructed');
            }
        }
    },

    onSquareClick : function(e) {

        /*
         The toggleMod method switches a block's or element's modifier
         between two values. You can find the method's signature
         in the BEM reference, /blocks/i-bem/i-bem.jsdoc.wiki
         */

        this.toggleMod('color', 'green', '');

    }

}, {

    live : function() {

        /*
         Live initialization is "on-demand initialization".
         It lets you initialize a block only when necessary,
         for example, when the user began working with the block directly.
         In this case, initialization occurs on a click event on the block.
         Initialization can also occur on an event on a block element,
         when nested or mixed blocks are initialized. You can find
         all the available initialization methods in the BEM DOM reference,
         /blocks/i-bem/dom/i-bem__dom.jsdoc.wiki
         */

        this.liveBindTo('click', function(e) {
            this.onSquareClick();
        });

        return false;

    }

}));

});

