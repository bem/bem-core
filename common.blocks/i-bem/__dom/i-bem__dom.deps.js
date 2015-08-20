[{
    shouldDeps : [
        'jquery',
        'objects',
        'functions',
        'dom',
        { mod : 'init' },
        { block : 'i-bem', elems : ['internal'] }
    ]
},
{
    tech : 'spec.js',
    mustDeps : [
        {
            block : 'i-bem',
            tech : 'bemhtml'
        }
    ]
}]
