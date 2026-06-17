// import { fn, result, variables } from "./addMinutesToDate 0.js";
// import { fn, result, variables } from "./addMultipleEvents 0";   //

variables.forEach((item, idx) => {
	if (!fn(...item) === result[idx]) {
		throw new Error("error");
	}
});
console.log("ok");

// -1 初级
//  0 中级
//  1 高级
