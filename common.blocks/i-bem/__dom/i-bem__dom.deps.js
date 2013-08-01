[{
    shouldDeps: [
        'jquery',
        'objects',
        'functions',
        'dom',
        { block: 'i-bem', elems: ['internal'] },
        { block: 'ecma', elem: 'string' }
    ]
},
{
    tech: 'test.js',
    mustDeps: [
        {
            block: 'i-bem',
            tech: 'bemhtml'
        }
    ]
}]
