/*
title: Check if array elements are equal based on function
tags: array
cover: orange-coffee-2
firstSeen: 2020-10-19T22:14:49+03:00
lastUpdated: 2020-10-19T22:14:49+03:00
*/

// checks if all elements in an array are equal, based on the provided function

const allEqualBy = (arr, fn) => {
	arr.every((item) => fn(item) === fn(arr[0]));
};
