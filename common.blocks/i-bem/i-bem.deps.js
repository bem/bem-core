({
    shouldDeps: [
        'inherit',
        'identify',
        'next-tick',
        'objects',
        'functions',
        { block: 'events', elems: ['channels'] },
        { block: 'ecma', elem: 'object' },
        { block: 'ecma', elem: 'array' },
        { block: 'ecma', elem: 'function' }
    ]
})