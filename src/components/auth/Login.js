import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Grid, Header, Icon, Form, Segment, Button, Message } from 'semantic-ui-react'
import './Login.css'
import firebase from "../../firebase";

class Login extends Component {

  state = {
    email: '',
    password: '',
    loading: false,
    errors: []  
  }

  handleChange = (event) => {
    const {name, value} = event.target;
    this.setState({[name]: value});
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.isFormValid()){
      this.setState({errors: [], loading:true})
      const{email, password} = this.state;
      firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then((signedInUser) => {
          console.log(signedInUser);
          this.setState({loading: false})
          this.props.history.push('/');
        })
        .catch((err) => {
          console.log(err);
          this.setState({errors: [err], loading: false})
        })
    }
  }

  isFormValid =() => {

    if(!(this.state.email && this.state.password)){
      const error = {message: 'email or password is empty'};
      this.setState({errors: [error]});
      return false;
    }
    return true;
  }

  handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName))? 'error':'';
  }

  displayErrors = (errors) => errors.map((error, i) => <p key={i}>{error.message}</p>)

  render() {
    const {email, password, loading, errors} = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className='app'>
        <Grid.Column style={{maxWidth: 450}}>
            <Header as='h2' icon color='violet'>
              <Icon name='code branch' color='violet'></Icon>
              Login to Worklist
            </Header>

            <Form size='large' onSubmit={this.handleSubmit}>
              <Segment stacked>
                  <Form.Input fluid name='email' icon='mail' value={email} iconPosition='left' placeholder='email address' type='email' className={this.handleInputError(errors, 'email')} onChange={this.handleChange}>
                  </Form.Input>
                  
                  <Form.Input fluid name='password' icon='lock' value={password} iconPosition='left' placeholder='password' type='password' onChange={this.handleChange} className={this.handleInputError(errors, 'password')}>
                  </Form.Input>

                  <Button className={loading? 'loading' : ''} fluid size='large' color='violet'>Login</Button>        
              </Segment>
            </Form>
            {errors.length>0 && (<Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>)}
            

            <Message>
              Don't have an account? <Link to='/register'>Register</Link>
            </Message>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Login
