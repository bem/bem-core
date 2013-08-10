({
    block : 'page',
    title : 'noDeps',
    head : [
        { elem : 'css', url : '_60page-nodeps_bem.css' },
        { elem : 'js', url : '_60page-nodeps_bem.js' }
    ],
    content : [
        {
            block : 'b-form-select',
            name : 'example',
            mods : { size : 's', theme : 'grey' },
            content : [
                {
                    block : 'b-form-button',
                    type : 'button',
                    mods : { size : 's', theme : 'grey-s', valign : 'middle' },
                    content : 'Пример'
                },
                {
                    elem : 'select',
                    content : [
                        {
                            elem : 'option',
                            attrs : { value : 'send' },
                            content : 'Отправленные'
                        },
                        {
                            elem : 'option',
                            attrs : { value : 'draft' },
                            content : 'Черновики'
                        },
                        {
                            elem : 'option',
                            attrs : { value : 'inbox' },
                            content : 'Входящие'
                        },
                        {
                            elem : 'option',
                            attrs : { value : 'del' },
                            content : 'Удаленные'
                        }
                    ]
                }
            ]
        }
    ]
})
