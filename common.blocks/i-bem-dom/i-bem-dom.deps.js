({
    shouldDeps : [
        'inherit',
        'jquery',
        'objects',
        'functions',
        'dom',
        { mod : 'init' },
        { block : 'i-bem', elems : ['internal'] },
        { elem : 'events', mods : { type : ['dom', 'bem'] } },
        { elem : 'collection' }
    ]
})
