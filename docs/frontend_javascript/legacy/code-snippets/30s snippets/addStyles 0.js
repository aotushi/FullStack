/* title: Add styles to HTML element
tags: browser
author: chalarangelo
cover: digital-nomad-14
firstSeen: 2021-01-07T00:37:43+02:00
lastUpdated: 2021-01-07T00:37:43+02:00 */

// adds the provided styles to the given html element

const addStyles = (el, styles) => Object.assign(el.style, styles);

addStyles(document.getElementById("my-element"), {
	background: "red",
	color: "#ffff00",
	fontSize: "3rem",
});
