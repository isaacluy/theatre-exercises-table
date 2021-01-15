import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-toolbox/lib/button';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(ev) {
    ev.preventDefault();
    const email = document.loginForm.email.value;
    const pass = document.loginForm.password.value;
    this.props.auth.signInWithEmailAndPassword(email, pass)
      .catch(error => console.log('An Error occurred signing in: ', error.message));
  }

  render() {
    return (
      <div>
        <h2 className="col-md-8 col-md-offset-2">
          {'Login'}
        </h2>
        <form
          className="col-md-8 col-md-offset-2"
          method="get"
          name="loginForm"
          onSubmit={this.handleSubmit}
        >
          <div id="inputs">
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                className="form-control"
                id="email"
                placeholder="Email"
                type="email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                className="form-control"
                id="password"
                placeholder="Password"
                type="password"
              />
            </div>
          </div>
          <div id="buttons">
            <Button
              label='Log In'
              primary
              raised
              type='submit'
            />
            <Button
              label='Clear'
              raised
              type='reset'
            />
          </div>
        </form>
      </div>
    );
  }
};

Login.displayName = 'Login';

Login.propTypes = {
  auth: PropTypes.object.isRequired
};

export default Login;
