```metadata
title: Javascript Interview Questions
author: tushar-mathur
date: 2014-jul-12
template: article.jade
```
#Chapter 4 - Expressions and Operators
1.	What is the length of the following Array initialization?  
	```javascript
	arr1 = [1,2,,,3]
	arr2 = [1,2,3,,]
	arr1 = [1,2,3,]
	```
**Ans.**	The last comma inside an array initialization is ignored. Thus the result is as follows - `5`, `4` and `3`.