I have been wanting to create an application which should be able to help me in calculating shared expenses. The idea is to create an application which would work with commands 


#Execution Syntax
1. Adding a transaction

	a. Known total amount.
	
		```
		John Michael Laura > 600 > John Michael Pooja 
		```
	b. Unknown total amount.
	
		```
		John = 500 Michael = 300 + 40 > John Michael Pooja 
		```
	
	c. Split in ratios.
	
		```
		John Michael & 1 Laura > 800 > John Michael & 2*7+9 Pooja & 1
		```

	d. With hast tags.

		```
		John Michael Laura > 500 > John Michael Pooja #games #home #food
		```
2. Query a transaction.

	a. With hash tag 
	
		```
		#games 
		```

	b. With names and hash tag
		
		```
		Michael #work Laura
		```
3. Update a transaction with id `23`

	```
	$23 >> John Michael & 1 Laura > 800 > John Michael & 2 Pooja & 1
	```
	
4. Duplicate transaction with id `23`, `8` times.

	```
	$23 >> 8
	```
5. Delete a transaction

	```
	$23 > 0
	```
