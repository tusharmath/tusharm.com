```metadata
title: Decomposing react components
author: tushar-mathur
date: 2016-01-16
template: article.jade
```

I want to talk about how you can break a huge, complicated component into smaller specialized ones. 

# Part 1 (The Problem Statement)

So say I want to list out all the repositories of a github user ([sindresorhus](https://github.com/sindresorhus?tab=repositories)).


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

There is a problem though— more likely than not I will have to handle the scenario where I don't have anything in my state which is intitally set to `null`. So I need to add another condition to the render function —

```javascript 
render () {
  if(this.state === null){
    return null
  }
  return (
    <ul>
      {this.state.respositories.map(x => <li>{x}</li>)}
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

There is a problem here — the input box falls under the [controlled](https://facebook.github.io/react/docs/forms.html#controlled-components) component category. So we need to set the value every time we update it.

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
I want to add one more feature. I want to show text — `no results found` when the repositories don't match the search input.

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
        {this.state.fRepos.length === 0 ? <span>No Results Found<span> : <ul>
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
      this.setState({fRepors})
      
      this.setState({filter})
    }
    
    return (
      <div>
        // Added another condition!
        {this.state === null ? <span>Loading...</span> : <input type="text" onKeyPress={onKeyPress}     value={this.state.filter} />
        {this.state.fRepos.length === 0 ? <span>No Results Found<span> : <ul>
          {this.state.fRepos.map(x => <li>{x}</li>)}
        </ul>}
        }
      </div>
    )
  }

```

Okay, I can't take in any more feature request until I refactor this code!

# Part 2 (Refactoring)
...
