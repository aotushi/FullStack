/**
 * @what add multiple listeners
 * @how 
 *  - Use `Array.prototype.forEach()` and `EventTarget.addEventListener()` to add multiple event listeners with an assigned callback function to an element.
 */

const addMultipleListeners = (el, types, listeners, options, useCapture) => {
  types.forEach(type =>
    el.addEventListener(type, listeners, options, useCapture))
}

addMultipleListeners(
  document.querySelector('.my-element'),
  ['click', 'mousedown'],
  () => { console.log('hello!' )}
)
