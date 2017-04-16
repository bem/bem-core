<?php
return function ($bh) {

    $bh->match('page__css', function ($ctx, $json) {
        if (!key_exists('ie', $json)) {
            return;
        }
        $ie = $json->ie;
        if ($ie === true) {
            $url = $json->url;
            return array_map(function ($v) use ($url) {
                return [ 'elem' => 'css', 'url' => $url . '.ie' . $v . '.css', 'ie' => 'IE ' . $v ];
            }, [6, 7, 8, 9]);
        } else {
            $hideRule = !$ie?
                ['gt IE 9', '<!-->', '<!--'] :
                ($ie === '!IE'?
                    [$ie, '<!-->', '<!--'] :
                    [$ie, '', '']);
            return [
                '<!--[if' . $hideRule[0] . ']>' . $hideRule[1],
                $json,
                $hideRule[2] . '<![endif]-->'
            ];
        }
    });

};
