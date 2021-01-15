import React from 'react';
import { render } from 'react-dom';
import Login from './components/login';
import ExercisesTable from './components/exercisesTable';
import { initializeFirebase, getFirebaseAuth } from './services/firebaseHelpers';

// TODO: Use React router to determine where we go? Register vs Login
class AppContainer extends React.Component {
  constructor(props) {
    super(props);

    initializeFirebase();

    this.state = {
      auth: getFirebaseAuth(),
      user: null
    };
  }

  componentDidMount() {
    this.state.auth.onAuthStateChanged(user => {
      if(user) {
        console.log('User authenticated');
        this.setState({ user });
      } else {
        console.log('User not authenticated, please Log In');
        this.setState({ user: null });
      }
    });
  }

  render() {
    return (
      <div className="container">
        {
          this.state.user ? (
            <ExercisesTable
              auth={this.state.auth}
              tableName={'Theatre Exercises Table'}
            />
          ) : (
            <div>
              <h1 className="col-md-8 col-md-offset-2">
                {'Welcome to the Theatre Exercises App'}
              </h1>
              <Login auth={this.state.auth} />
            </div>
          )
        }
      </div>
    );
  }
}

AppContainer.displayName = 'AppContainer';

render(<AppContainer/>, document.getElementById('app'));
