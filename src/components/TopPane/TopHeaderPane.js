import React, { Component, Fragment } from "react";
import {
  Header,
  Icon,
  Segment,
  Button,
  Modal,
  Form,
  Input,
} from "semantic-ui-react";
import {
    refreshWorkDateDataId,
  setWorkDate,
  setWorkDateData,
} from "../../redux/workdates/workDateActions";
import { connect } from "react-redux";
import firebase from "../../firebase";

class TopHeaderPane extends Component {
  state = {
    modal: false,
    workName: "",
    workDateRef: firebase.database().ref("workdates"),
    worksRef: firebase.database().ref("works"),
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
      const{workName, worksRef} = this.state;
      if(this.props.workDateData){
          this.saveWork(this.props.workDateData.id, workName, worksRef);
          this.props.refreshWorkDateDataId(Math.random());
        }else{
          this.saveWorkDate();   
          this.props.refreshWorkDateDataId(Math.random());     
      }
  };

  saveWorkDate() {
    if (this.isFormValid(this.state)) {
      const { workDateRef, workName, worksRef } = this.state;
      const { user, workDate } = this.props;
      const key = workDateRef.push().key;

      const newWorkDate = {
        id: key,
        date: workDate,
        uid: user.uid,
      };

      workDateRef
        .child(key)
        .update(newWorkDate)
        .then(() => {
          console.log("success");
          this.saveWork(key, workName, worksRef)
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  saveWork = (key, workName, worksRef) => {
    const newWork = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      name: workName,
      status: "TODO",
    };

    worksRef.child(key).push().set(newWork).then(()=>{
        console.log('save work');
        this.closeModal();
        this.props.refreshWorkDateDataId()
    }).catch(err => {
        console.log(err)
    })
  };

  isFormValid = ({ workName }) => workName;

  closeModal = () => {
    this.setState({ modal: false });
  };

  openModal = () => {
    this.setState({ modal: true });
  };

  render() {
    const { modal } = this.state;
    const { workDate } = this.props;
    return (
      <Fragment>
        <Segment clearing>
          <Header>
            <Icon name="calendar"></Icon>
            <Header.Content>
              {" "}
              <h1>Date: {workDate}</h1>{" "}
            </Header.Content>
          </Header>
          <Button icon="plus" floated="right" onClick={this.openModal}></Button>
        </Segment>

        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Add a Work</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  fluid
                  label="Work Name: "
                  name="workName"
                  onChange={this.handleChange}
                ></Input>
              </Form.Field>
            </Form>
          </Modal.Content>

          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSubmit}>
              <Icon name="checkmark"></Icon>Add
            </Button>

            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove"></Icon>Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Fragment>
    );
  }
}



const mapStateToProps = ({ workDates: { workDate, workDateData }, users: { user } }) => ({
  workDate: workDate,
  workDateData: workDateData,
  user: user,
});

const mapDispatchToProps = (dispatch) => ({
  setWorkDate: (workDate) => dispatch(setWorkDate(workDate)),
  setWorkDateData: (data) => dispatch(setWorkDateData(data)),
  refreshWorkDateDataId: (id) => dispatch(refreshWorkDateDataId(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TopHeaderPane);
