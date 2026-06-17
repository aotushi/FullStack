/* 
title: Add weekdays to date
tags: date
cover: digital-nomad-9
firstSeen: 2020-10-11T16:51:39+03:00
lastUpdated: 2021-01-08T00:23:44+02:00
*/

// calculates the date after adding the given number of business days

// example
/*
addWeekDays(new Date('Feb 24,2023'), 5) //'Thi 3, 2023
addWeekDays(new Date('Feb 23,2023'), 5) //'Thi 2, 2023'
*/

const addWeekDays = (startDate, count) =>
	Array.from({ length: count }).reduce((date) => {
		date = new Date(date.setDate(date.getDate() + 1));
		if (date.getDay() % 6 === 0) {
			date = new Date(date.setDate(date.getDate() + (date.getDay() / 6 + 1)));
		}
	}, startDate);
