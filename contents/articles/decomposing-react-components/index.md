```metadata
title: Decomposing react components
author: tushar-mathur
date: 2016-01-16
template: article.jade
```

I want to talk about how you can break a huge, complicated component into smaller specialized ones. So say I want to list out all the repositories of a github user ([sindresorhus](https://github.com/sindresorhus?tab=repositories)).


```javascript
// Usual Imports
import {Component} form 'react'

class Repository extends Component {
  componentWillMount () {
    fetch('https://api.github.com/users/sindresorhus/repos')
    .then(x => x.json())
    .then(x => this.setState({repositories: x}))
  }
  
  render () {
    return (
      <ul>
        {this.state.respositories.map(x => <li>{x}</li>)}
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

