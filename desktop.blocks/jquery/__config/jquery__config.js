/**
 * @module jquery__config
 * @description Configuration for jQuery
 */

import base from 'bem:jquery__config';
import ua from 'bem:ua';
import objects from 'bem:objects';

export default ua.msie && parseInt(ua.version, 10) < 9?
    objects.extend(
      base,
      { url : '//yastatic.net/jquery/1.11.3/jquery.min.js' }) :
    base;
