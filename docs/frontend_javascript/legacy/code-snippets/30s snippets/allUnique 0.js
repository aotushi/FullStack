/*
title: Check if all array elements are unique
tags: array
cover: jars-on-shelf
firstSeen: 2020-10-19T19:47:26+03:00
lastUpdated: 2021-01-08T00:23:44+02:00
*/

// checks if all elements in an array are unique

// const allUnique = arr => arr.every(item => arr.includes())

const allUnique = (arr) => arr.length === new Set(arr).size;
