import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-toolbox/lib/button';

class Logout extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(ev) {
    ev.preventDefault();
    this.props.auth.signOut();
  }

  render() {
    return (
      <Button
        className="logout"
        label='Log Out'
        onClick={this.handleClick}
        primary
        raised
        type='button'
      />
    );
  }
};

Logout.displayName = 'Logout';

Logout.propTypes = {
  auth: PropTypes.object.isRequired
};

export default Logout;
