/**
 * @what Add event listener to all targets
 * @how 
 *  - - Use `Array.prototype.forEach()` and `EventTarget.addEventListener()` to attach the provided `listener` for the given event `type` to all `targets`.
 */

const addEventListenerAll = (targets, type, listener, options, useCapture) => {
  targets.forEach(target => {
    target.addEventListener(type, listener, options, useCapture)
  })
}
