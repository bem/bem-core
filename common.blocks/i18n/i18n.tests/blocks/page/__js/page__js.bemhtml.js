block('page').elem('js').def()(function() {
    this.ctx.url = this.i18n('page', 'js');
    return applyNext();
});
