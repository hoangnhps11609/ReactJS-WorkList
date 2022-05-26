import React, { Component } from "react";
import { connect } from "react-redux";
import { Divider, Header, Icon, Segment, Button } from "semantic-ui-react";
import firebase from "../../firebase";
import { refreshWorkDateDataId } from "../../redux/workdates/workDateActions";

class ToDoPane extends Component {
  state = {
    worksRef: firebase.database().ref("works"),
  };

  handleDeleteWork = (work) => {
    const { worksRef } = this.state;
    const { workDateId } = this.props;

    worksRef
      .child(workDateId)
      .child(work.id)
      .remove()
      .then(() => {
        this.props.refreshWorkDateDataId(Math.random());
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleUpdateWork = (work) => {
    const { worksRef } = this.state;
    const { workDateId } = this.props;

    worksRef
      .child(workDateId)
      .child(work.id)
      .update({
        name: work.name,
        status: "DONE",
        timestamp: firebase.database.ServerValue.TIMESTAMP,
      })
      .then((updatedWork) => {
        console.log(updatedWork);
        this.props.refreshWorkDateDataId(Math.random());
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const { toDoWorks } = this.props;
    return (
      <Segment stacked>
        <Header>
          <Icon name="bell" color="red"></Icon>
          <Header.Content>To Do</Header.Content>
        </Header>
        <Divider></Divider>
        {toDoWorks &&
          toDoWorks.length > 0 &&
          toDoWorks.map((item) => (
            <Segment key={item.id} attached clearing>
              {item.name}
              <Button
                icon="trash alternate"
                inverted
                color="red"
                floated="right"
                size="tiny"
                onClick={() => this.handleDeleteWork(item)}
              ></Button>
              <Button
                icon="checkmark"
                inverted
                color="green"
                floated="right"
                size="tiny"
                onClick={() => this.handleUpdateWork(item)}
              ></Button>
            </Segment>
          ))}
      </Segment>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  refreshWorkDateDataId: (id) => dispatch(refreshWorkDateDataId(id)),
});

export default connect(null, mapDispatchToProps)(ToDoPane);
