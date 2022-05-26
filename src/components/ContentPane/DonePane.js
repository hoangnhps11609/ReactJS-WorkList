import React, { Component } from "react";
import { connect } from "react-redux";
import { Divider, Header, Icon, Segment, Button } from "semantic-ui-react";
import { refreshWorkDateDataId } from "../../redux/workdates/workDateActions";
import firebase from "../../firebase";

class DonePane extends Component {
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

  render() {
    const { doneWorks } = this.props;

    return (
      <Segment stacked>
        <Header>
          <Icon name="calendar check outline" color="green"></Icon>
          <Header.Content>Done</Header.Content>
        </Header>
        <Divider></Divider>
        {doneWorks &&
          doneWorks.length > 0 &&
          doneWorks.map((item) => (
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
            </Segment>
          ))}
      </Segment>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  refreshWorkDateDataId: (id) => dispatch(refreshWorkDateDataId(id)),
});

export default connect(null, mapDispatchToProps)(DonePane);
