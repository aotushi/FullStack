// 未添加装饰器

class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  greet() {
    console.log(`Hello, my name is ${this.name}`);
  }
}

const person = new Person("John");
person.greet();

// 添加装饰器
/**
 * 想要自定义其方法,实现的效果
 *  greet() {
      console.log("LOG: Entering method.");

      console.log(`Hello, my name is ${this.name}.`);

      console.log("LOG: Exiting method.")
    }
 */

function loggedMethod(originalMethod: any, _context: any) {
  function replacementMethod(this: any, ...args: any[]) {
    console.log("LOG: Entering method.");
    originalMethod.apply(this, args);
    console.log("LOG: Exiting method.");
  }
  return replacementMethod;
}

class Person2 {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  @loggedMethod
  greet() {
    console.log(`Hello, my name is ${this.name}`);
  }
}

const person2 = new Person2("John");
person2.greet();

// 装饰器2 - 参数

/**
 * 
 * 第二个参数,称作上下文对象,'context object'
 * 
 * 通常会用来保存被装饰方法的信息. 打印信息如下:
 * _context {
    kind: 'method',
    name: 'greet', 
    static: false,
    private: false,
    access: { has: [Function: has], get: [Function: get] },
    metadata: undefined,
    addInitializer: [Function (anonymous)]
  }
 *
* 
* name: 函数名称
* static: 是否是类的静态方法
* private: 是否是私有方法
* addInitiallizer: 在构造函数(或如果处理的是静态成员,则是在类本身初始化时)之前进行钩子操作的方法
*
 * 
 */

  // 问题代码 this丢失
class Person3 {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  greet1() {
    console.log(`Hello, my name is ${this.name}`);
  }

  greet2 = () => {
    console.log(`Hello, my name is ${this.name}`);
  }
}

const greet1 = new Person3("John").greet1
greet1();

// 使用装饰器解决this丢失问题

function bound(originalMethod:any, context: ClassMethodDecoratorContext) {
  const methodName = context.name;
  if (context.private) {
    throw Error (`'bound' cannot decorate private properties like ${methodName as string}.`)
  }

  context.addInitializer(function(this:any) {
    this[methodName] = this[methodName].bind(this);
  })
}

class Person4 {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  // 执行顺序是反向的
  @bound
  @loggedMethod
  greet() {
    console.log(`Hello, my name is ${this.name}`);
  }
}

const person4 = new Person4("John").greet
person4();