({
    mustDeps: [
        {
            block: 'i-bem',
            elems: [
                'html',
                { elem: 'dom', mods: { init: 'auto' } },
            ]
        },
        { block: 'ua' }
    ],
    shouldDeps: { elems: ['css', 'js'] }
})
