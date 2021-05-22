1. What is the difference between Component and PureComponent? give an
   example where it might break my app.

When creating a class-based component it is possible to optimise the performance
by overriding shouldComponentUpdate lifecycle method. By default it returns true
for each call. But it is possible to make, for example, comparisons between
prev props and current props passed to the component and return true/false
depending on if you want or don't want to rerender it. Extending Pure component
does this comparison for us. Though it is not a deep comparison, but a shallow one.
So, it helps us not to render, when props between renders didn't change.

2. Context + ShouldComponentUpdate might be dangerous. Can think of
   why is that?

 As far as I remember, `shouldComponentUpdate` can't cancel rerenders, when
 context provider value changes.

3. Describe 3 ways to pass information from a component to its PARENT.

  * Parent creates a callback function and passes it to its child as a prop. At some point
child calls it, passing the information to it, so the parent gets notified and
gets the data
  * Same as before, but parent passes the callback with the help of react context
  * With pubsub pattern of some external library, for example.
The parent subscribes to changes in componentDidMount or in useEffect hook and child
sends data to that library. Parent gets notified, as a subscriber.
  * Pretty simmilar to the first one. Passing function to child like that:

```javascript
<Child>{(dataFromChild) => <div>{dataFromChild}</div>}</Child>
```

4. Give 2 ways to prevent components from re-rendering.

 For class components - override `shouldComponentUpdate` / extend PureComponent.
 For functional component - `React.memo`

5. What is a fragment and why do we need it? Give an example where it
   might break my app.

Almost same as Fragment for DOM. It wraps react elements/components and renders as
if it didn't exist. It gives the ability to avoid situation, when you don't want
to return single entity, but want to return several. (Fragment is used in the challenge
exercise to return multiple `<li>` elements without creating a wrapping `<ul>` component for them).
It can break an app, when you accidently return several elements with fragment,
but just one element is expected. It may break styling.

6. Give 3 examples of the HOC pattern.

* Redux's `connect` HOC
* React router `withRouter` HOC
* Handwritten:

```javascript
function withLoggingPropsOnMount(WrappedComponent) {
  return class extends Component {
    componentDidMount() {
      console.log(this.props);
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}
```

7. What's the difference in handling exceptions in promises, callbacks and
async...await.

Errors in Promises are handled in .catch clause like that:
```javascript
Promise.resolve().then(() => {
  throw new Error('Some error message');
}).catch(e => console.error(e));
```

Async...await is just a syntactic sugar over promises. The errors are handled
in try...catch...finally blocks

```javascript
  try {
    const result = await doSomeBuggyRequest();
  } catch(e) {
    console.error('Error was caught')
  }
```

In callbacks there is some kind of convention of arguments sequence, which
says, that the first argument is an error if it happened and null, if everything
is okey

```javascript
  function doSomeStaff(callback) {
    ...doing some staff
    if (error) {
      callback(error);
    } else {
      callback(null, data);
    }
  }
```

8. How many arguments does setState take and why is it async.

It takes one or two arguments. And the first argument comes in two flavours.
If next state calculation doesn't rely on prevState and props -> we can pass an
object. `setState({ someStateProp: someStateValue })`

if we need up-to-date state and props we pass a callback
`(state, props) => ({ someValue: state.someValue + 1 })`

The second argument is a callback, which is guaranteed to be called after all
the updates were applied

As far as I remember, setState is async because this behavior helps to batch updates
and this way reduce the number of rerenders. Also, it may be used for some
internal optimisations inside react itself.

9. List the steps needed to migrate a Class to Function Component.

* Return value from render method of class component becomes return value of the
functional component
* State from class components should be splitted between useState hooks
* NON-lifecycle methods are put as functions or wrapped in useCallback hook and
put inside functional component
* class component properties are put into useRef hook
* `createRef` turns into `useRef` either
* `componentDidMount`, `componentDidUpdate`, `componentWillUnmount` are replaced
with useEffect/useLayoutEffect
* `shouldComponentUpdate` can be implemented with `React.memo`
* some logic can be moved to custom hooks
* error boundary logic should be moved to the parent or removed, as currently
functional components can't have this logic

10. List a few ways styles can be used with components.

We can directly set styles for elements:
`<div style={{ backgroundColor: 'grey' }}>Hello world</div>`

We can set classes `<div className="wrapper">...</div>`.
We also can combine both approaches.
Also, different helper libraries for working with CSS-in-JS can be used,
for example `styled-components`

11. Used it just a pair of times, so it should be something like that:
`<div dangerouslySetHtml={{ __html: 'some_html_string' }}></div>`
