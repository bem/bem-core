({
    shouldDeps : [
        'inherit',
        'jquery',
        'objects',
        'functions',
        'dom',
        { elem : 'init' },
        { block : 'i-bem', elems : ['internal'] },
        { elem : 'events', mods : { type : ['dom', 'bem'] } },
        { elem : 'collection' }
    ]
})
