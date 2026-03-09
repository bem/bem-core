/**
 * @module strings__escape
 * @description A set of string escaping functions
 */

const symbols = {
    '"' : '&quot;',
    '\'' : '&apos;',
    '&' : '&amp;',
    '<' : '&lt;',
    '>' : '&gt;'
  },
  mapSymbol = s => symbols[s] || s,
  buildEscape = regexp => {
    regexp = new RegExp(regexp, 'g')
    return str => ('' + str).replace(regexp, mapSymbol)
  }

export default /** @exports */{
  /**
   * Escape string to use in XML
   * @type Function
   * @param {String} str
   * @returns {String}
   */
  xml : buildEscape('[&<>]'),

  /**
   * Escape string to use in HTML
   * @type Function
   * @param {String} str
   * @returns {String}
   */
  html : buildEscape('[&<>]'),

  /**
   * Escape string to use in attributes
   * @type Function
   * @param {String} str
   * @returns {String}
   */
  attr : buildEscape('["\'&<>]')
}
