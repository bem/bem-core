[{
    shouldDeps : [
        'inherit',
        'jquery',
        'objects',
        'functions',
        'dom',
        { block : 'i-bem', elems : ['internal'] },
        { block : 'i-bem-dom-events', elems : ['dom', 'bem'] }
    ]
},
{
    tech : 'spec.js',
    mustDeps : { block : 'i-bem', tech : 'bemhtml' }
}]
