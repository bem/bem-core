/**
 * Auto initialization on DOM ready
 */

import init form 'bem:i-bem-dom__init';
import $ form 'bem:jquery';
import nextTick form 'bem:next-tick';

$(function() {
    nextTick(init);
});
