## Installation

1. Install npm and nodejs
2. Run `npm install -g webpack webpack-dev-server && npm install`


## Running the Dev Server

To start the dev server simply run `webpack-dev-server --hot` from your nearest command line interface (note: you have to run it in this folder so it knows which webpack.config to load).

## Notes
- ES6 introduces classes (which are just fancy prototypes)
- React is small, composible components
- <div></div> in JSX is a component.
- <CommentBox></CommentBox> is also a valid component in JSX (just a custom one that we defined).
- We are composing CommentBox with CommentSection
- define: composing: (of elements) constitute or make up (a whole).
- So basically a ComentSection is composed of CommentBox + div + h1
- Ok, more components
- This one has defaultProps (it's a static property so it is defined on the prototype itself)
- props are data for components
- lets use the props to generate some data-driven HTML
- curly braces in jsx is javascript inside JSX (which is inside javascript. So meta!)
- ok, let's pass in data and control our CommentList from the outside now: <CommentList comments={myComments} />. Suprise! Props can be set using attributes in JSX!

# Follow Up (Bonus Material!)
- we can do more with props. What about adding an onChange prop to CommentBox and wiring it up to the <input>'s onChange? Then we could do <CommentBox onChange={function() {console.log("change!")}} />
- props are immutable inside the component. So we can only change them from the outside (with attributes).
- state is also useful. It's for the component's internal data and can be changed inside the component (think jQuery data attributes).
Check out: https://facebook.github.io/react/docs/tutorial.html#reactive-state
- fetch is a new standard API that replaces XHR or if you use jquery $.get and it's included in this app!
Check out: https://developer.mozilla.org/en/docs/Web/API/Fetch_API
- React CSS Modules make CSS dependencies much more manageable by making them declarative and composable (like react!). Check them out: https://github.com/gajus/react-css-modules
- React Animations can be helpful if you need to do simple transitions when components are added and removed.
Check out: https://facebook.github.io/react/docs/animation.html
