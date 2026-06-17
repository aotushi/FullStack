/*
title: Check if array elements are equal
tags: array
cover: shelf-plant
firstSeen: 2018-08-03T00:03:08+03:00
lastUpdated: 2020-10-18T20:24:28+03:00
*/

// checks if all element in an array are equal

// const allEqual = (arr) => arr.every((item, idx) => item === arr[idx]);
const allEqual = (arr) => arr.every((item) => item === arr[0]);
