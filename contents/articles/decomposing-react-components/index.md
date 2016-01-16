```metadata
title: Decomposing react components
author: tushar-mathur
date: 2016-01-16
template: article.jade
```

I want to talk about how you can break a huge, complicated component into smaller specialized ones. 

## Use case 
Say I want to list out all the repositories of a github user ([sindresorhus](https://github.com/sindresorhus?tab=repositories)).


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

```
