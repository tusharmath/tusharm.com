```metadata
title: Decomposing react components
author: tushar-mathur
date: 2016-01-16
template: article.jade
```

I want to talk about how you can break a huge, complicated component into smaller specialized ones. 

# Part 1 (The Problem Statement)

So say I want to list out all the repositories of a github user (eg. [sindresorhus](https://github.com/sindresorhus?tab=repositories)).


```javascript
// Usual Imports
import {Component} form 'react'

class Repository extends Component {
  componentWillMount () {
    fetch('https://api.github.com/users/sindresorhus/repos')
    .then(x => x.json())
    .then(x => this.setState({repos: x}))
  }
  
  render () {
    return (
      <ul>
        {this.state.repos.map(x => <li>{x}</li>)}
      </ul>
    )
  }
}

// Append to the first child of the body
ReactDOM.render(<Repository/>, document.body.children[0])

```
So here I am using the [fetch](https://github.com/whatwg/fetch) method to make a request to the github's API getting the response, parsing it to `json` and setting it on to the state. The fetching is done as soon as the component is about to mount. The `render()` method is called automatically as soon as the state is updated.

There is a problem though — state which is intitally set to `null` will throw an exception when I will try to access `state.repos`. So I need to add another condition to the render function —

```javascript 
render () {
  if(this.state === null){
    return null
  }
  return (
    <ul>
      {this.state.repos.map(x => <li>{x}</li>)}
    </ul>
  )
}
```
So far so good. I want to add another functionality now, being able to do a real time search on the repository names. 

```javascript 

class Repository extends Component {
  componentWillMount () {
    fetch('https://api.github.com/users/sindresorhus/repos')
    .then(x => x.json())
    // create fRepos, that represents the filtered set of repos
    .then(x => this.setState({repos: x, fRepos: x}))
  }
  
  render () {
    if(this.state === null){
      return null
    }
    
    const onKeyPress = e => {
      const fRepos = this.state.repos.filter(x => x.name.match(e.target.value))
      this.setState({fRepors})
    }
    
    return (
      <div>
        // Add a search box
        <input type="text" onKeyPress={onKeyPress} />
        <ul>
          {this.state.fRepos.map(x => <li>{x}</li>)}
        </ul>
      </div>
    )
  }
}
```

So I added an input box and attached an event handler for the keypress event. I also keep two lists, `repos` and `fRepos` where fRepos represents the filtered list of the repositories.

There is a problem here — the input box falls under the [controlled](https://facebook.github.io/react/docs/forms.html#controlled-components) component category. So we need to set its value every time keyPress event is fired.

```javascript
  render () {
    if(this.state === null){
      return null
    }
    
    const onKeyPress = e => {
      // Create a variable
      const filter = e.target.value
      const fRepos = this.state.repos.filter(x => x.name.match(filter))
      this.setState({fRepors})
      
      // Set the filter value to state
      this.setState({filter})
    }
    
    return (
      <div>
        <input type="text" onKeyPress={onKeyPress} value={this.state.filter} />
        <ul>
          {this.state.fRepos.map(x => <li>{x}</li>)}
        </ul>
      </div>
    )
  }

```
I want to add one more feature. I want to show text — `no respositories found` when the repositories don't match the search input.

```javascript
  render () {
    if(this.state === null){
      return null
    }
    
    const onKeyPress = e => {
      const filter = e.target.value
      const fRepos = this.state.repos.filter(x => x.name.match(filter))
      this.setState({fRepors})
      
      this.setState({filter})
    }
    
    return (
      <div>
        <input type="text" onKeyPress={onKeyPress} value={this.state.filter} />
        // Add a condition to check the length
        {this.state.fRepos.length === 0 ? <span>No Repositories Found<span> : <ul>
          {this.state.fRepos.map(x => <li>{x}</li>)}
        </ul>}
      </div>
    )
  }

```

So I have added a simple if condition that renders the list if the `fRepos.length > 0` otherwise, just show `no results found`.

Okay, this is good, does the job though already kinda messy. Now, I need to add another feature now, I want to show a loader till the time the fetch request doesn't get completed inplace of the list.

```javascript
  render () {
    // Removed null check condition from here and moved it to the jsx part
  
    const onKeyPress = e => {
      const filter = e.target.value
      const fRepos = this.state.repos.filter(x => x.name.match(filter))
      this.setState({fRepors, filter})
    }
    
    return (
      <div>
        // Added another condition!
        {this.state === null ? <span>Loading...</span> : <input type="text" onKeyPress={onKeyPress}     value={this.state.filter} />
        {this.state.fRepos.length === 0 ? <span>No Repositories Found<span> : <ul>
          {this.state.fRepos.map(x => <li>{x}</li>)}
        </ul>}
        }
      </div>
    )
  }

```

**Complete Code**

```javascript
import {Component} form 'react'

class Repository extends Component {
  componentWillMount () {
    fetch('https://api.github.com/users/sindresorhus/repos')
    .then(x => x.json())
    .then(x => this.setState({repos: x}))
  }

  render () {
    const onKeyPress = e => {
      const filter = e.target.value
      const fRepos = this.state.repos.filter(x => x.name.match(filter))
      this.setState({fRepors, filter})
    }
    
    return (
      <div>
        {this.state === null ? <span>Loading...</span> : <input type="text" onKeyPress={onKeyPress}     value={this.state.filter} />
        {this.state.fRepos.length === 0 ? <span>No Repositories Found<span> : <ul>
          {this.state.fRepos.map(x => <li>{x}</li>)}
        </ul>}
        }
      </div>
    )
  }
}

// Append to the first child of the body
ReactDOM.render(<Repository/>, document.body.children[0])

```

Okay, I can't take in any more feature request until I refactor this code!


# Part 2 (Breaking Components)

There are three concepts involved with rendering — **How** & **When**.

How should I render — I should use the return value of the render() function. This should be in control of the component in context, more specificly its `render` method.

When should I render — I should render when certain condition are satisfied. This should again be in control of the component but not via the `render` method. Since render is already involved in the *how* part, we should have some better mechanism of delegating this responsibility to someone else.

In our case we have mixed the two concepts together and one component's render() method is doing eveything. So first lets break this huge component into smaller ones.


```javascript
class UnorderedList extends Class {
  render () {
    if(this.props.items || this.props.items.length === 0){
      return null
    }
    return (
      <ul>
        {this.props.items.map(x => <li>{x}</li>)}
      </ul>
    )
  }
}
```

Created a new component `UnorderedList`, this only renders when the length of the item is non zero. Now this is a reusable component that I can use for listing the filtered repositories. I can apply the same concept for showing the `No Repositories Found` message, such that the logic for **When** to show and **How** to show stays inside the component itself.

```javascript
class NoRepositories extends Component {
  render () {
    if(this.props.repos && this.props.repos.length > 0){
      return null
    }
    return (
      <div>No Respositories Found</div>
    )
  }
}
```

Similarly for the loading message —

```javascript
class Loading extends Component {
  render () {
    if(this.props.repos){
      return null
    }
    return (
      <div>Loading ...</div>
    )
  }
}
```

Next, I will create a new view called `FilteredRepos` —

```javascript
class FilteredRepos extends Component {
  render () {
    const props = this.props
    if(!props.repos){
      return null
    }
    return (
      <div>
        <input value={props.filter} onFilterChanged={x => props.onKeyPress(x.target.value)}/>
        <UnorderedList items={props.repos.filter(x => x.name.match(props.filter))}/>
        <NoRepositories repos={props.repos} />
      </div>
    )
  }
}
```
FilteredRepos, doesn't render if `props.repos` is `null`. It's child `UnorderedList` will not render if the items list provided to it is empty and the similar concept is applicable to `NoRepositories` component.


Merging the new components with the `Repository` —

```javascript
class Repository extends Component {
  componentWillMount () {
    fetch('https://api.github.com/users/sindresorhus/repos')
    .then(x => x.json())
    .then(x => this.setState({repos: x}))
  }  
  
  render () {
    const state = this.state
    return (
      <div>
        <Loading {...state} />
        <FilterView {...state} onFilterChanged={filter => this.setState({filter})} />
      </div>
    )
  }
}
```

So we have concluded part one of the refactoring where each component decides by it self, when should it be shown and how it should be shown.

# Part 3 (Control rendering declaratively)

Reading those `if conditions` in between of the render method to decide if the component needs to be rendered or not, should not be the render function's responsibility. We can fix it by using the [react-render-if](https://github.com/tusharmath/react-render-if) package. The package exposes a decorator `renderIf` which takes in functions as predicates and calls them one by one with the current instance of the component as the first param. If the return value of each of the predicates is `Truthy` then the component is rendered.

For example —
```javascript
import {renderIf} from 'react-render-if'

@renderIf(i => i.props.repos)
class FilteredRepos extends Component {
  render () {
    const props = this.props
    return (
      <div>
        <input value={props.filter} onFilterChanged={x => props.onKeyPress(x.target.value)}/>
        <UnorderedList items={props.repos.filter(x => x.name.match(props.filter))}/>
        <NoRepositories repos={props.repos} />
      </div>
    )
  }
}

@renderIf(x => !i.props.repos)
class Loading extends Component {
  render () {
    return<div>Loading ...</div>
  }
}

@renderIf(x => x.props.repos, x => x.props.repos.length === 0)
class NoRepositories extends Component {
  render () {
    return <div>No Respositories Found</div>
  }
}
```
The declarative approach makes it much easier for me to understand the render function's main responsibility.

I have removed all the `if conditions` from the code, which makes the code it a lot more readable.


**Final Code**

```javascript

import {renderIf} from 'react-render-if'

@renderIf(i => i.props.repos)
class FilteredRepos extends Component {
  render () {
    const props = this.props
    return (
      <div>
        <input value={props.filter} onFilterChanged={x => props.onKeyPress(x.target.value)}/>
        <UnorderedList items={props.repos.filter(x => x.name.match(props.filter))}/>
        <NoRepositories repos={props.repos} />
      </div>
    )
  }
}

@renderIf(x => !i.props.repos)
class Loading extends Component {
  render () {
    return<div>Loading ...</div>
  }
}

@renderIf(x => x.props.repos, x => x.props.repos.length === 0)
class NoRepositories extends Component {
  render () {
    return <div>No Respositories Found</div>
  }
}

class Repository extends Component {
  componentWillMount () {
    fetch('https://api.github.com/users/sindresorhus/repos')
    .then(x => x.json())
    .then(x => this.setState({repos: x}))
  }  

  render () {
    const state = this.state
    return (
      <div>
        <Loading {...state} />
        <FilterView {...state} onFilterChanged={filter => this.setState({filter})} />
      </div>
    )
  }
}
```
