import "./App.css";

import React, { Component } from "react";
import { Grid, Divider } from "semantic-ui-react";
import SidePane from "./SlidePane/SidePane";
import firebase from "../firebase";
import { clearUser, setUser } from "../redux/users/userActions";
import { connect } from "react-redux";
import TopHeaderPane from "./TopPane/TopHeaderPane";
import ContentPane from "./ContentPane/ContentPane";
import EmptyContentMessage from "./ContentPane/EmptyContentMessage";

export class App extends Component {
  handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.props.clearUser();
      });
  };

  render() {
    const {workDate, workDateData, refreshWorkDateDataId} = this.props;

    return (
      <Grid stretched styles={{ background: "#eee" }} stackable>
        <Grid.Column width="4">
          <SidePane onSignout={this.handleSignout}></SidePane>
        </Grid.Column>

        <Grid.Column width="12">
          <Grid.Column>
            <Grid.Column width="16">
              <Grid.Row>
                <TopHeaderPane></TopHeaderPane>
              </Grid.Row>

              <Divider></Divider>

              <Grid.Row>
                {this.props.workDateData ? (
                  <ContentPane key={`${workDateData.id}${refreshWorkDateDataId}`}
                    workDateId = {workDateData.id}
                    workDate = {workDate}></ContentPane>
                ) : (
                  <EmptyContentMessage key={workDate} workDate={workDate}></EmptyContentMessage>
                )}
              </Grid.Row>
            </Grid.Column>
          </Grid.Column>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = ({ users: { loading }, workDates: {refreshWorkDateDataId, workDate, workDateData} }) => ({
  workDate: workDate,
  workDateData,
  refreshWorkDateDataId
});

const mapDispatchToProps = (dispatch) => ({
  setUser: (user) => dispatch(setUser(user)),
  clearUser: () => dispatch(clearUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
