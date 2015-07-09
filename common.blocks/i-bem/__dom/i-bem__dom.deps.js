[{
    shouldDeps : [
        'jquery',
        'objects',
        'functions',
        'dom',
        { elem : 'dom', mod : 'init' }, // TODO: remove elem field after enb-bem/enb-bem-techs#158
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
