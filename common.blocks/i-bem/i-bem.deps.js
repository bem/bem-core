({
    mustDeps: [
        'inherit',
        'identify',
        'next-tick',
        'objects',
        'functions',
        'events'
    ],
    shouldDeps: [
        { block: 'ecma', elem: 'object' },
        { block: 'ecma', elem: 'array' },
        { block: 'ecma', elem: 'function' }
    ]
})