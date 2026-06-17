window.onload = function () {
	window.addEventListener("resize", calc);

	function calc() {
		let rem = document.documentElement.clientWidth / 10;
		document.documentElement.style.fontSize = rem + "px";
		rem = document.documentElement.clientWidth > 750 ? 37.5 : rem;
	}
};
