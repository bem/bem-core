({
    mustDeps: [
        'inherit',
        'identify',
        'next-tick',
        'objects',
        'functions',
        { block: 'events', elems: ['channels'] }
    ],
    shouldDeps: [
        { block: 'ecma', elem: 'object' },
        { block: 'ecma', elem: 'array' },
        { block: 'ecma', elem: 'function' }
    ]
})