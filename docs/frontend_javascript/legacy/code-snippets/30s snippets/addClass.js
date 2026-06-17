/**
 * @title Add class to HTML element
 * @how
 *  - Use `Element.classList` and `DOMTokenList.add()` to add the specified class to the element
 */

const addClass = (el, className) => el.classList.add(className);

addClass(document.querySelector('p'), 'special')
