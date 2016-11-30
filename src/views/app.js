var React = require('react'),
    ReactRouter = require("react-router"),
    DefaultRoute = ReactRouter.DefaultRoute,
    Route = ReactRouter.Route,
    ReactDOM = require('react-dom'),
    FluxStores = require("./flux");

var Page = require('./components/page'),
	Login = require('./routes/login'),
	Home = require('./routes/home');

var flux = FluxStores.initializeStore('store');

var RoutesNavigation = [
    <ReactRouter name="login" path="/" handler={Page}>
        <DefaultRoute handler={Login} />
        <Route path="/login" handler={Login} />
        <Route path="/home" handler={Home} />
    </ReactRouter>
];

ReactRouter.run(RoutesNavigation, function (Handler, state) {
	ReactDOM.render(<Handler flux={flux} />, document.getElementById('reactContainer'));
});