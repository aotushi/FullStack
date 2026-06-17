/*
title: Check if all array elements are unique based on function
tags: array
cover: digital-nomad-10
firstSeen: 2020-10-19T22:15:05+03:00
lastUpdated: 2021-01-08T00:23:44+02:00
*/

// checks if all elements in an array unique, based on the provided mapping function.

const allUniqueBy = (arr, fn) => (arr, fn) => arr.length === new Set(arr.map(fn)).size;
