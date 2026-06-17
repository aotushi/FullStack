/* title: Add multiple listeners
tags: browser,event
cover: balloons
firstSeen: 2020-10-08T00:40:30+03:00
lastUpdated: 2020-10-22T20:23:47+03:00 */

// adds multiple event listeners with the same handler to an element

const addMultipleEvents = (el, types, listener, options, userCapture) => {
	types.forEach((type) => el.addEventListener(type, listener, options, userCapture));
};

const variables = [
  document.querySelector('.my-element'),
  ['click', 'mousedown'],
  () => {console.log('hello')}
]
export { addMultipleEvents as fn };
