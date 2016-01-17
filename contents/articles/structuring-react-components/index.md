```metadata
title: structuring react components
author: tushar-mathur
date: 2016-01-16
template: article.jade
```

I want to talk about how you can break a huge, complicated component into smaller specialized ones.

# Part 1 (The Problem Statement)

So say I want to list out all the repositories of a github user (eg. [sindresorhus](https://github.com/sindresorhus?tab=repositories)).

<iframe width="100%" height="300" src="//jsfiddle.net/mn3tvuac/5/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

So here I am using the [fetch](https://github.com/whatwg/fetch) method to make a request to the github's API getting the response, parsing it to `json` and setting it on to the state. The fetching is done as soon as the component is about to mount. The `render()` method is called automatically as soon as the state is updated.

There is a problem though — state which is initially set to `null` will throw an exception when I will try to access `state.repos`. So I need to add another condition to the render function —

<iframe width="100%" height="300" src="//jsfiddle.net/mn3tvuac/6/embedded/js,html,result" allowfullscreen="allowfullscreen" frameborder="0"></iframe>


So far so good. I want to add another functionality now, being able to do a real time search on the repository names.

<iframe width="100%" height="300" src="//jsfiddle.net/mn3tvuac/9/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

So I added an input box and attached an event handler for the `onKeyUp` event. I also keep two lists, `repos` and `fRepos` where `fRepos` represents the filtered list of the repositories.


I want to add one more feature. I want to show text — `no repositories found` when the repositories don't match the search input.

<iframe width="100%" height="300" src="//jsfiddle.net/mn3tvuac/10/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>


So I have added a simple if condition that renders the list if the `fRepos.length > 0` otherwise, just show `no repositories found`.


Okay, this is good, does the job but if you go to the results page, you will see that it also shows the message initially when the repositories are yet to be loaded from the API. I should ideally show a `loading...` message, till the time the fetch request doesn't get completed.

<iframe width="100%" height="300" src="//jsfiddle.net/mn3tvuac/11/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

# Part 2 (Breaking Components)

If you observe the `render()` function, it pretty messy right now. It tries to render different things on different occasion. This logic will only get complicated unless I decompose the render function.

For example — if I have a component `A` that renders child components `P, Q, R` in different combinations, then the logic of rendering them individually can actually lie inside the individual components `P, Q, R`, instead of their parent `A`. This helps us achieve [single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle) where the render function of `A` only determines which all components it will `mount`. Whether they actually render or not is their (`P, Q, R`) own responsibility.

In our case we can remove all the `if` conditions from the main `Repositories` component and create smaller specialized ones that encapsulate when they should render.

To start with the component decomposition, we can create a component called `NoRepositories` which shows the 'No Repositories found' message when the filtered results are empty. Similarly we can create a component `UnorderedList` which renders only when a list of items is provided to it.

<iframe width="100%" height="800" src="//jsfiddle.net/m5e40ywL/1/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

Effectively we got rid of one condition from the render method. We can apply the same concept for the loading message also, by creating a `Loading` component. The subtle difference here is that, I want to hide input box and the user name, at the time of loading. This can be done by making the content a child of `Loading` component —

<iframe width="100%" height="800" src="//jsfiddle.net/m5e40ywL/2/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

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
