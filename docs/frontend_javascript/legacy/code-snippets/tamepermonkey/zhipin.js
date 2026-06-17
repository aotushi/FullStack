// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *.zhipin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhipin.com
// @grant        none
// ==/UserScript==

(function () {
	"use strict";
  // 实现筛选后批量发送消息
  // https://www.zhipin.com/web/geek/job?city=101120200&areaBusiness=370211
	
})();

/**
 * 
 *  getGeekFriendList.json?page=n(>=0)  已经聊过的boss列表
 * 
 *  https://www.zhipin.com/wapi/zpgeek/search/joblist.json?scene=1&query=&city=101120200&experience=&payType=&partTime=&degree=&industry=&scale=&stage=&position=&jobType=&salary=&multiBusinessDistrict=370211&multiSubway=&page=1&pageSize=30
 * 
 * 
 * 
 * 
 * 
 */



// 生成一个排序的函数
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值,含最小值 
}
