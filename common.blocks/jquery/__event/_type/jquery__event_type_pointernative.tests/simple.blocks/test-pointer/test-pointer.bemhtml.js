block('test-pointer')(
    content()(function() {
        return [
            { elem : 'label', content : 'root' },
            this.ctx.content
        ];
    }),
    elemMatch(function() { return this.elem && this.elem.indexOf('inner') === 0; }).content()(function() {
        return [
            { elem : 'label', content : this.elem.slice(-1) },
            this.ctx.content
        ];
    })
);
