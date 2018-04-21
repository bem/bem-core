module.exports = {
    root : true,

    levels : [
        {
            layer : 'common',
            scheme : 'nested'
        },
        {
            layer : 'desktop',
            scheme : 'nested'
        },
        {
            layer : 'touch',
            scheme : 'nested'
        }
    ],

    sets : {
        common : 'common',
        desktop : 'common desktop',
        touch : 'common touch'
    }
};
