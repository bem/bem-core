([
{
    tech: 'vanilla.js',
    shouldDeps: [
        {tech: 'vanilla.js', block: 'inherit'},
        {tech: 'vanilla.js', block: 'identify'},
        {tech: 'vanilla.js', block: 'next-tick'},
        {tech: 'vanilla.js', block: 'objects'},
        {tech: 'vanilla.js', block: 'functions'},
        {tech: 'vanilla.js', block: 'events'},
        {tech: 'vanilla.js', block: 'events', elem: 'channels'},
        {tech: 'vanilla.js', block: 'ecma', elem: 'object'},
        {tech: 'vanilla.js', block: 'ecma', elem: 'array'},
        {tech: 'vanilla.js', block: 'ecma', elem: 'function'},
    ]
},
{
    tech: 'test.js',
    shouldDeps: {tech: 'vanilla.js', block: 'i-bem'}
}
])
