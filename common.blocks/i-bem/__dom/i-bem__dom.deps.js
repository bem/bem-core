[{
    shouldDeps : [
        'jquery',
        'objects',
        'functions',
        'dom',
        { block : 'i-bem', elems : ['internal'] },
        { block : 'ecma', elems : ['string', 'json'] }
    ]
},
{
    tech : 'test.js',
    mustDeps : [
        {
            block : 'i-bem',
            tech : 'bemhtml'
        }
    ]
}]
