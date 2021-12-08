import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Menu, Segment, Image } from 'semantic-ui-react'
import { getVideosByUser } from './api/videos-api'

import Auth from './auth/Auth'
import { EditVideo } from './components/EditVideo'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Videos } from './components/Videos'
import { VideosByUser } from './components/VideosByUser'

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (
      <div>
        <Segment style={{ padding: '0em 0em' }} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={16}>
                <Router history={this.props.history}>
                  {this.generateMenu()}


                  {this.generateCurrentPage()}
                </Router>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    )
  }

  generateMenu() {
    return (
      <Menu>
        <Menu.Item name="home">
          <Link to="/">
            <Image src="https://static.thenounproject.com/png/459516-200.png" size="mini"/>
            UdaTube
          </Link>
        </Menu.Item>

        <Menu.Menu position="right">{this.logInLogOutButton()}</Menu.Menu>
      </Menu>
    )
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu>
        <Menu.Item name="logout" onClick={() => {this.props.history.push(`/myvideos`)}}>
          My videos
        </Menu.Item>
        <Menu.Item name="logout" onClick={this.handleLogout}>
          Log Out
        </Menu.Item>
        </Menu>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.handleLogin}>
          Log In
        </Menu.Item>
      )
    }
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return (
          <Videos/>
      )
    }

    return (
      <Switch>
        <Route
          path="/myvideos"
          exact
          render={props => {
            return <VideosByUser {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/"
          exact
          render={props => {
            return <Videos/>
          }}
        />

        <Route
          path="/videos/:videoId/edit"
          exact
          render={props => {
            return <EditVideo {...props} auth={this.props.auth} />
          }}
        />

        <Route component={NotFound} />
      </Switch>
    )
  }

  generatePublicVidesPage() {
    
  }
}
