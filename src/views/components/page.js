var FluxStores = require('./../flux'),
    ReactRouter = require('react-router'),
    RouteHandler = ReactRouter.RouteHandler,
    React = require("react"),
    ReactBootstrap = require("react-bootstrap"),
    cookie = require('react-cookie');

var Navbar = ReactBootstrap.Navbar,
    Nav = ReactBootstrap.Nav;

var Page = React.createClass({

    mixins: FluxStores.getMixins('store'),

    componentWillMount: function () {
        if (!cookie.load('accessToken')) {
            window.location = '/#/login';
        } else {
            window.location = '/#/home';
        } 
    },

    shouldComponentUpdate: function (nextProps, nextState) {
        if (!cookie.load('accessToken')) {
            window.location = '/#/login';
        } else {
            window.location = '/#/home';
        } 

        return true;
    },

    render: function() {
        return (
            <div>
                <RouteHandler />
            </div>
        );
    }
});

module.exports = Page;
