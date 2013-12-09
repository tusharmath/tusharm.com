Personal Notes for AngularJS.

#Concept	Description
**Template** HTML with additional markup.

**Directives** extend HTML with custom attributes and elements, `ng-controller`, `hg-app`

**Model** the data that is shown to the user and with which the user interacts

**Scope** context where the model is stored so that controllers, directives and expressions can access it

**Expressions**	access variables and functions from the scope

**Compiler** parses the template and instantiates directives and expressions

**Filter**	formats the value of an expression for display to the user

View	what the user sees (the DOM)

Data Binding	sync data between the model and the view

Controller	the business logic behind views

Dependency Injection	Creates and wires objects / functions

Injector	dependency injection container

Module	configures the Injector

Service	reusable business logic independent of views


**Controllers:** 
1. JS Constructor Function
2. Attched to the dom using the `ng-controller` directive.
3. It shouldn't do much, most of the work should be done in services and injected using the Dependency Injection feature of angular.

**Filters:**
1. Can be used in the views using a pipe.
2. 



*
*Modules:**