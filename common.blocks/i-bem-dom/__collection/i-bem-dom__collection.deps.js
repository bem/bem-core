[{
    shouldDeps : [
        'inherit',
        { block : 'i-bem', elem : 'collection' }
    ]
},
{
    tech : 'spec.js',
    mustDeps : { block : 'i-bem', tech : 'bemhtml' },
    shouldDeps : [
        { block : 'i-bem', tech : 'js' },
        { block : 'objects', tech : 'js' },
        { block : 'i-bem-dom', tech : 'js' }
    ]
}]
