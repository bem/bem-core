/**
 * Auto initialization on DOM ready
 */

import init from 'bem:i-bem-dom__init';
import $ from 'bem:jquery';
import nextTick from 'bem:next-tick';

$(function() {
    nextTick(init);
});
