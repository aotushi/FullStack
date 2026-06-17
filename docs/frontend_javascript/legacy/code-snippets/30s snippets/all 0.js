/*
title: Test if all array elements are truthy
tags: array
cover: touch-flower
firstSeen: 2018-02-14T11:46:15+02:00
lastUpdated: 2020-10-18T20:24:28+03:00
*/

// checks if the provided predicate function returns 'true' for all element in a collection

const all = (arr, fn = Boolean) => arr.every(fn);
