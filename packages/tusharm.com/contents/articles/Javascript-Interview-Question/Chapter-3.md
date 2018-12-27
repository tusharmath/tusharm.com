```metadata
title: Javascript Interview Questions

date: 2013-08-24
template: article.jade
```
# Chapter 3 - Types, Values and Variables
1.	What are the different categories of objects in Javascript?
	Ans.	Primitive: ```undefined```, ```null```, String, Boolean, Number
		Object type: Array, Object, Function, Date, Error, RegEx
2.	State some method less types in JS.
	Ans.	```undefined``` and ```null``` are the two types.

3.	Give examples of mutable and non-mutable object types.
	Ans.	**Mutable:** Object, Array and **Non-Mutable:** Boolean, Numbers, Strings

4.	Are Strings mutable in JS?
	Ans. No they are non-mutable objects.

	```javascript
	var str = 'tushar';

	console.log(str);		//tushar
	console.log(str[2]) 	//s

	str[2] = 'x'

	console.log(str[2]) 	//s
	console.log(str)		//tushar
	```

5.	How can you specify integer literals?
	Ans.
	```javascript
	//Decimal
	var e = 10;

	//Hexadecimal
	var f = 0xA;

	//Octal (not supported by ECMAScript standard)
	var g = 07;

	//Exponents to the base 10
	var h = 2e5 // Represents 2,00,000
	```

6.	How to check if the number is a finite number without using isNaN or isFinite methods?
	Ans. No, because of its unusual behavior.

	```javascript
	NaN == NaN; //false

	x = NaN;
	x != x; //true
	```

7.	What happens to precision when you use floating point numbers such as .1, .2 etc?
	Ans. Binary floating point numbers have to round of such values.

	```javascript
	var x = .3 - .2; 	// 30 cents minus 20 cents => 0.09999999999999998
	var y = .2 - .1; 	// 20 cents minus 10 cents => 0.1
	x == y;				// => false: the two values are not the same!
	x == .1;			// => false: .3-.2 is not equal to .1
	y == .1;			// => true: .2-.1 is equal to .1
	```
8.	What is the default unit of difference of two dates?
	Ans. Milliseconds.

9.	How are strings encoded in Javascript?
	Ans. Javascript uses UTF 16 encoding. In a string each char is represented by a 16 bit value. Incase you want to store a value which is bigger than 16 bit you can use a sequence of multiple 16 bit values. Overall the string manipulation methods apply on 16bits only and not on characters. The length property will also tell the

10. How to represent a string literal in multiple lines?
	Ans. Use backslash '\' for Eg.
	```javascript
	var x = 'tushar\
	mathur\
	is\
	a\
	good\
	boy';
	```

11.	How is a NULL character represented in Javascript?
	Ans. Null character can be represented using '\0' or \u0000

12.	How are RegEx represented in Javascript?
	Ans. RegEx are not primitive types but can still be initialized using literals with forward slashes, for e.g.
	```javascript
	var pattern = /[1-9][0-9]*/
	```

13.	What are *falsy* values in Javascript?
	Ans. ```undefined```, ```null```, 0, -0, NaN, "" are all *falsy* values. When equated to false the result is always true. Other than these values everything else is javascript is a *truthy* values.

14.	What is the difference between ```null``` and ```undefined```?
	Ans. Comparison of ```null``` and ```undefined``` -
	* Both are falsy values.
	* Both represent absence of values.
	* Both are method less types.
	* ```typeof null``` returns ```object``` where as ```typeof undefined``` returns ```undefined```.
	* Undefined has a deeper meaning - represents that the variable has not be assigned a value and is generally considered as a system level absence of value.
	* ```null``` can be considered as a program level absence of value.

15.	What is a method?
	Ans. When functions are referred as properties of objects, they are called as methods.

16.	If string, number, boolean are of primitive types then why do they have methods and properties associated with them?
	Ans. Whenever a property is accessed in any of the string, number or boolean type object the interpreter creates a temporary object using there constructors. It then refers to the properties and methods and later discards that object.

17.	What will be the output of the following code?
	```javascript
	var s = 'tushar';
	s.len = 4;
	var t = s.len;
	console.log(t);
	```
	Ans. The output will be ``````undefined``````. Because strings are primitive type objects and in the second line when the ```len``` property is accessed it is done so by creating a temporary object which is later discarded. In the third line when ```len``` is again accessed a new temporary object is created using ```s``` string which has no information about the ```len``` property.

18.	What will be the output of the following code?
	```javascript
	x = 10;
	y = new Number(10);

	console.log(x==y, x===y);

	```
	Ans. The output will ```true``` and ```false```. This is because the ```typeof x``` and ```typeof y``` are different as x is a primitive type ```number``` and y is of object type ```object```.

19.	Compare and contrast primitive and object types.
	Ans.

	**Primitive:** ```null```, ```undefined```, ```number```, ```string```, ```boolean```
	* They are compared using only values and thus are also called as *value type*
	* They are immutable. You can not modify the values but you can create a copy.

	**Object:**  ```Function```, ```Object```, ```Array```, ```Date```, ```Error```, ```TypeError```, ```RegEx```
	* They are *reference type* and two objects are equal only if their references are equal.
	* They are mutable.

20. Can ```undefined``` and ```null``` be type casted to ```Object``` type?
Ans. No, it will throw a ```TypeError``` exception.

21. How are arrays converted to strings?
Ans.
	```javascript
	[].toString() // => ""
	[1].toString() // => "1" or "a"
	[1,2,3].toString() // => "1, 2, 3" or "a, b, c"
	```
22. How are different types of values converted to number type?
Ans.
	* Strings that can be parsed as numbers are converted to numbers else produce a ```NaN``` value. Empty strings are 0.
	* ```true``` is 1 and ```false``` is 0.
	* Arrays with single elements are parsed and the first element is parsed again to check if it can be a number else ```NaN``` is returned by default.

23. How are primitive to Object conversion carried out?
Ans. Simply using there wrapper objects.

24. Is is legal to use a variable without declaring it?
Ans. It is not allowed in Strict mode. In case you still do it you will assign the variable as a property to the global object

25. What happens in the following code -
	```javascript
	a = 100

	(function(){
		a = 200;
		b = 300;
	}());

	console.log(a+b)
	```
	Ans. The answer is ```500```. Because if we use a non declared variable anywhere in the code it is assigned to the Global object as a property.

26.	What is the output of the following code -

	```javascript
	var _whatIsMyName = function() {
		console.log(this.name);
	};

	var item = {
		name: 'Grandpa',
		whatIsMyName: _whatIsMyName,
		child: {
			name: 'Father',
			whatIsMyName: _whatIsMyName,
			child: {
				name: 'Son',
				whatIsMyName: _whatIsMyName
			}
		}
	};

	item.whatIsMyName();
	item.child.whatIsMyName();
	item.child.child.whatIsMyName();
	```
	Ans.
	```bash
	Grandpa
	Father
	Son
	```
27.	Determine the output of the following code -

	```javascript
	var b = 'mangoes';
	var c = 'apples';
	(function() {
		console.log(b,c);
		var b = 100;
		c = 30;
	}());
	```
	Ans. The output will be ```undefined```. This feature of Javascript is called as *Hoisting*. Accessibility to variables which are yet to be initialized.

***

More on **Type Conversion** later, till then take a look at this [snapshot](type-conversions.png) from the book.
