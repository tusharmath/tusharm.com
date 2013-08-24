---
title: Javascript Interview Questions
author: tushar-mathur
date: 2013-08-24
template: article.jade
---
This article contains a list of items that I learnt from [David Flanagan's Javascript the Definitive Guide.](http://shop.oreilly.com/product/9780596805531.do) 
I am going to present the ideas in terms of a **Q&A** format and will cover each chapter one by one.

##Chapter 3 - Types, Values and Variables
1.	What are the different categories of objects in Javascript?  
	Ans.	Primitive: undefined, null, String, Boolean, Number
		Object type: Array, Object, Function, Date, Error, RegEx	
2.	State some method less types in JS.  
	Ans.	undefined and null are the two types.

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
	x == y;				// => false: the two values are not the same! 	x == .1;			// => false: .3-.2 is not equal to .1	y == .1;			// => true: .2-.1 is equal to .1	```
8.	What is the default unit of difference of two dates?  
	Ans. Milliseconds.	
	