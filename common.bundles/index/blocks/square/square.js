/**
 * The block's BEM declaration can state which block (a block with a modifier or a block
 * with a specific modifier value)
 * a given JavaScript component refers to.
 *
 * You can find various declarations on the i-bem block's wiki page, blocks/i-bem/i-bem.wiki
 */
import bemDom from 'bem:i-bem-dom';
import BEMHTML from 'bem:BEMHTML';

export default bemDom.declBlock(this.name, {
    _onSquareClick : function() {
        this.toggleMod('color', '', 'green');
        bemDom.update(this.domElem, BEMHTML.apply({
            block : 'test',
            content : 'client BEMHTML test'
        }));
    }
}, {
    live : function() {
        console.log('??????');
        this._domEvents().on('pointerdown', this.prototype._onSquareClick);
        return false;
    }
});
