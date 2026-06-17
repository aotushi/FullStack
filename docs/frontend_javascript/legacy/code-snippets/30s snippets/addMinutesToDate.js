/**
 * 
title: Add minutes to date
tags: date
cover: lake-trees
firstSeen: 2020-11-28T19:27:46+02:00
lastUpdated: 2020-11-28T19:27:46+02:00
 */

// Calculates the date of `n` minutes from the given date, returning its string representation

const addMinutesToDate = (date, n) => {
	const d = new Date(date);
	d.setTime(d.getTime() + n * 1000 * 60);
	return d.toISOString().split(".")[0].replace("T", " ");
};

// demo

addMinutesToDate("2023-02-23 12:00:00", 10);
addMinutesToDate("2023-02-24", -10);

const variables = [
	["2023-02-23 12:00:00", 10],
	["2023-02-24", -10],
];
const result = ["2020-10-19 12:10:00", "2020-10-18 23:50:01"];

export { addMinutesToDate as fn, variables, result };
