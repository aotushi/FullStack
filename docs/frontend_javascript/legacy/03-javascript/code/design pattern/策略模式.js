// 计算每个人的奖金金额

var calculateBonus = function (performanceLevel, salary) {
  if (performanceLevel === "S") {
    return salary * 4;
  }

  if (performanceLevel === "A") {
    return salary * 3;
  }

  if (performanceLevel === "B") {
    return salary * 2;
  }
};

calculateBonus("B", 20000); // 输出：40000
calculateBonus("S", 6000); // 输出：24000

/**
 * 以上代码存在的问题:
 * - 函数结构庞大,包含了很多if-else语句
 * - 缺乏弹性,如果新增了新的奖金计算方式,需要修改函数逻辑.违反开放-封闭原则
 * - 算法的复用性差
 */

// 重构1 组合函数

var performanceS = function (salary) {
  return salary * 4;
};

var performanceA = function (salary) {
  return salary * 3;
};

var performanceB = function (salary) {
  return salary * 2;
};

var calculateBonus = function (performanceLevel, salary) {
  if (performanceLevel === "S") {
    return performanceS(salary);
  }

  if (performanceLevel === "A") {
    return performanceA(salary);
  }

  if (performanceLevel === "B") {
    return performanceB(salary);
  }
};

calculateBonus("A", 10000); // 输出：30000

/**
 * 以上代码存在的问题:
 * - 函数可能越来越庞大
 */

// 重构2 使用策略模式-版本1-面向对象

var performanceS = function () {};

performanceS.prototype.calculate = function (salary) {
  return salary * 4;
};

var performanceA = function () {};

performanceA.prototype.calculate = function (salary) {
  return salary * 3;
};

var performanceB = function () {};

performanceB.prototype.calculate = function (salary) {
  return salary * 2;
};

var Bonus = function () {
  this.salary = null; // 原始工资
  this.strategy = null; // 绩效等级对应的策略对象
};

Bonus.prototype.setSalary = function (salary) {
  this.salary = salary; // 设置员工的原始工资
};

Bonus.prototype.setStrategy = function (strategy) {
  this.strategy = strategy; // 设置员工绩效等级对应的策略对象
};

Bonus.prototype.getBonus = function () {
  // 取得奖金数额
  return this.strategy.calculate(this.salary); // 把计算奖金的操作委托给对应的策略对象
};

var bonus = new Bonus();

bonus.setSalary(10000);
bonus.setStrategy(new performanceS()); // 设置策略对象

console.log(bonus.getBonus()); // 输出：40000

bonus.setStrategy(new performanceA()); // 设置策略对象
console.log(bonus.getBonus()); // 输出：30000

// 重构2 使用策略模式-版本1-js

var strategies = {
  S: function (salary) {
    return salary * 4;
  },
  A: function (salary) {
    return salary * 3;
  },
  B: function (salary) {
    return salary * 2;
  },
};

var calculateBonus = function (performanceLevel, salary) {
  return strategies[performanceLevel](salary);
};

calculateBonus("A", 10000); // 输出：30000

