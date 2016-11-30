var FluxStores = require('./../flux'),
    React = require("react"),
    ReactBootstrap = require("react-bootstrap");

var Form = ReactBootstrap.Form,
    FormGroup = ReactBootstrap.FormGroup,
    Col = ReactBootstrap.Col,
    FormControl = ReactBootstrap.FormControl,
    ControlLabel = ReactBootstrap.ControlLabel,
    Checkbox = ReactBootstrap.Checkbox,
    Button = ReactBootstrap.Button;

var Login = React.createClass({

    mixins: FluxStores.getMixins('store'),

    getInitialState: function() {
        return {
            username: '',
            password: '',
            rememberme: false
        };
    },

    _handleInput: function(type, event) {
        switch (type) {
            case 'submit':
                this.getFlux().actions.store.submitLogin({
                    username: this.state.username,
                    password: this.state.password,
                    rememberme: this.state.rememberme
                });  
                break;
            case 'username':
            case 'password':
                this.state[type] = event.target.value;
                this.setState(this.state);
                break;
            case 'rememberme':
                this.state[type] = event.target.checked;
                this.setState(this.state);
                break;
            default: break;
        }
    },

    getValidationState: function(type) {
        var length = this.state[type].length;
        if (length >= 5) return 'success';
        else if (length >= 0) return 'error';
    },

    render: function() {
        var _self = this;

        return (
            <Form className="loginForm">
                <FormGroup controlId="formHorizontalEmail" validationState={this.getValidationState('username')}>
                    <ControlLabel>Username</ControlLabel>
                    <FormControl type="email" placeholder="Email" onInput={_self._handleInput.bind(null, 'username')} value={this.state.username} /><FormControl.Feedback />
                </FormGroup>

                <FormGroup controlId="formHorizontalPassword" validationState={this.getValidationState('password')}>
                    <ControlLabel>Password</ControlLabel>
                    <FormControl type="password" placeholder="Password" onInput={_self._handleInput.bind(null, 'password')} value={this.state.password} /><FormControl.Feedback />
                </FormGroup>

                <FormGroup>
                    <Checkbox onClick={_self._handleInput.bind(null, 'rememberme')} checked={this.state.rememberme}>Remember me</Checkbox>
                </FormGroup>

                <FormGroup>
                    <Button onClick={_self._handleInput.bind(null, 'submit')}>
                        Sign in
                    </Button>
                </FormGroup>
                <div className="clear" />
            </Form>
        );
    }
});

module.exports = Login;
