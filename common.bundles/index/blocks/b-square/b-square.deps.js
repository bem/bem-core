({
    mustDeps : [
        {
            block : 'i-bem',
            elems : ['dom', 'html']
        }
    ],
    shouldDeps : [
        {
            block : 'b-square',
            mods : { color : 'green' }
        },
        { block : 'idle', mods : {'start' : 'auto'}}
    ]
})