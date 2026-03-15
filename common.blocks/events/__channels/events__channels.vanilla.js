/**
 * @module events__channels
 */

import events from 'bem:events'

const channels = new Map()

export default
  /**
   * Returns/destroys a named communication channel
   * @param {String} [id='default'] Channel ID
   * @param {Boolean} [drop=false] Destroy the channel
   * @returns {events:Emitter|undefined} Communication channel
   */
  function(id, drop) {
    if(typeof id === 'boolean') {
      drop = id
      id = undefined
    }

    id || (id = 'default')

    if(drop) {
      if(channels.has(id)) {
        channels.get(id).un()
        channels.delete(id)
      }
      return
    }

    let channel = channels.get(id)
    if(!channel) {
      channel = new events.Emitter()
      channels.set(id, channel)
    }
    return channel
  }
