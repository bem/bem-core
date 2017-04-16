<?php
return function ($bh) {

    $bh->match('page', function ($ctx) {
        $ctx->mix([ 'block' => 'ua', 'js' => true ]);
    });

    $bh->match('page__head', function ($ctx, $json) {
        $ctx
            ->applyBase()
            ->content([
                $json->content,
                [
                    'elem' => 'meta',
                    'attrs' => [
                        'name' => 'viewport',
                        'content' => 'width=device-width,' .
                            ($json->zoom?
                                'initial-scale=1' :
                                'maximum-scale=1,initial-scale=1,user-scalable=0')
                    ]
                ],
                [ 'elem' => 'meta', 'attrs' => [ 'name' => 'format-detection', 'content' => 'telephone=no' ] ],
                [ 'elem' => 'link', 'attrs' => [ 'name' => 'apple-mobile-web-app-capable', 'content' => 'yes' ] ]
            ], true);
    });

};
