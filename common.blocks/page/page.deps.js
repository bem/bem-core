({
    mustDeps: [
        {
            block: 'i-bem',
            elems: [
                'html',
                { elem: 'dom', mods: { init: 'auto' } },
            ]
        },
        { block: 'i-ua' }
    ],
    shouldDeps: { elems: ['css', 'js'] }
})
