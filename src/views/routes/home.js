var FluxStores = require('./../flux'),
    React = require("react"),
    ReactBootstrap = require("react-bootstrap"),
    cookie = require('react-cookie');

var Navbar = require('react-bootstrap').Navbar,
    Nav = require('react-bootstrap').Nav,
    NavItem = require('react-bootstrap').NavItem,
    MenuItem = require('react-bootstrap').MenuItem,
    NavDropdown = require('react-bootstrap').NavDropdown;

var Home = React.createClass({

    mixins: FluxStores.getMixins('store'),

    _handleInput: function(type, event) {
        switch (type) {
            case 'submit':
                this.getFlux().actions.store.submitLogout();  
                break;
            default: break;
        }
    },

    render: function() {
        var user = cookie.load('info') || {};
        var _self = this;

        return (
            <div className="container ground_MainContainer">
                <Navbar inverse fixedTop className="navbar-mainContainer">
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="/">
                                <span>
                                    Sample
                                </span>
                            </a>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav>
                            <NavItem eventKey={2} key="logout" onClick={_self._handleInput.bind(null, 'submit')}>Logout</NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <h1>{'Welcome ' + user.name}</h1>
            </div>
        );
    }
});

module.exports = Home;
