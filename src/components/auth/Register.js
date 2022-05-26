import md5 from "md5";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  Header,
  Icon,
  Form,
  Segment,
  Button,
  Message,
} from "semantic-ui-react";
import firebase from "../../firebase";
import "./Login.css";

class Register extends Component {
  state = {
    username: "",
    email: "",
    passwordDonfirmation: "",
    loading: false,
    errors: [],
    userRef: firebase.database().ref("users"),
  };

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.isFormValid()) {
      const { email, password, username, errors} = this.state;

      this.setState({ errors: [], loading: true });

      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((createdUser) => {
          console.log(createdUser);
          createdUser.user.updateProfile({
            displayName: username,
            photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
           }).then(() => {
             this.saveUser(createdUser).then(() => {
               console.log('user saved');
               this.setState({loading: false})
               this.props.history.push('/login');
             })
           })
        })
        .catch((err) => {
          console.log(err);
          this.setState({errors: [...errors, err], loading: false})
        });
    }
  };

  saveUser = (createdUser)=>{
    return this.state.userRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    });
  }

  isFormValid = () => {
    let errors = []
    let error;
    const{username, email, password, passwordConfirmation} = this.state;
    if(username?.length === 0 || email?.length === 0 || password?.length === 0  || passwordConfirmation?.length === 0 ){
      error = { message: 'Fill in all fields'};
      this.setState({errors: errors.concat(error)});
      return false;
    }else if(password?.length < 6 || passwordConfirmation?.length < 6 || password !== passwordConfirmation){
      error = { message: 'Password is invalid'};
      this.setState({errors: errors.concat(error)});
      return false;
    }
    return true;
  };

  displayErrors = (errors) => errors.map((error, i)=>(
    <p key={i}>{error.message}</p>
  ));

  handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName))? 'error':'';
  }

  render() {
    const { username, password, email, passwordConfirmation, loading } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="orange">
            <Icon name="puzzle piece" color="orange"></Icon>
            Register for Worklist
          </Header>

          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="username"
                type="username"
                value={username}
                onChange={this.handleChange} 
                className={this.handleInputError(this.state.errors, 'username')}
              ></Form.Input>

              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="email address"
                type="email"
                value={email}
                onChange={this.handleChange}
                className={this.handleInputError(this.state.errors, 'email')}
              ></Form.Input>

              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="password"
                type="password"
                value={password}
                onChange={this.handleChange}
                className={this.handleInputError(this.state.errors, 'password')}
              ></Form.Input>

              <Form.Input
                fluid
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="password confirmation"
                type="password"
                value={passwordConfirmation}
                onChange={this.handleChange}
                className={this.handleInputError(this.state.errors, 'passwordConfirmation')}
              ></Form.Input>

              <Button className={loading ? 'loading' : ''} fluid size="large" color="orange">
                Submit
              </Button>
            </Segment>
          </Form>


          {this.state.errors.length> 0 && (<Message error>
            <h3>Error</h3>
            {this.displayErrors(this.state.errors)}
          </Message>)}

          <Message>
            Already an account? <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
