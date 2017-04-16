<?php
return function ($bh) {
    $bh->match('page__js', function ($ctx, $json) {
        $ctx
            ->bem(false)
            ->tag('script');
        $json->url && $ctx->attr('src', $json->url);
    });
};
