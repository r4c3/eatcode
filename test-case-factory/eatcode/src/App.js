import { colors } from './global/vars'
import './global/fonts.css';
import { userContext } from './userContext';
import Axios from "axios";

import { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeaderSkip from './components/common/HeaderSkip';
import Landing from './pages/landing';
import Problems from './pages/problems';
import Question from './pages/question';
import Create from './pages/create';
import User from './pages/user'
import Error from './pages/error';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {
        userName: "Not Logged In",
        userID: null,
        userProfilePictureUrl: "https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061132_1280.png",
        isAdmin: false
      }
    }

    this.logIn = this.logIn.bind(this)
    this.logOut = this.logOut.bind(this)

    this.loggedOutUserObject = {
      userName: "Not Logged In",
      userID: null,
      userProfilePictureUrl: "https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061132_1280.png",
      isAdmin: false
    }
  }

  componentDidMount() {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      this.setState({user: {
        userName: foundUser.name,
        userID: foundUser.userID,
        userProfilePictureUrl: foundUser.profilePictureUrl,
        isAdmin: foundUser.isAdmin
      }})
    } else {
      this.setState({user: {
        userName: "Not Logged In",
        userID: null,
        userProfilePictureUrl: "https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061132_1280.png",
        isAdmin: false
      }})
    }
  }

  verifyAdmin() {
    return this.state.user.isAdmin
  }

  logOut() {
    this.setState({user: {
      userName: this.loggedOutUserObject.userName,
      userID: this.loggedOutUserObject.userID,
      userProfilePictureUrl: this.loggedOutUserObject.userProfilePictureUrl,
    }})
    localStorage.clear()
  }

  logIn(newUserData) {
    this.setState({user: {
      userName: newUserData.name,
      userID: newUserData.userID,
      userProfilePictureUrl: newUserData.profilePictureUrl,
      isAdmin: newUserData.isAdmin
    }})
    localStorage.setItem("user", JSON.stringify(newUserData))
    console.log('logged in', this.state.user)
  }

  render() {
    const styles = {
      app: {
        fontFamily: 'Inter',
        backgroundColor: colors.grey,
        height: '100vh',
        width: '100vw',
      },
      container: {
        overflowY: 'auto !important'
      }
    }
  
    const value = {
      user: this.state.user,
      logOutUser: this.logOut,
      logInUser: this.logIn
    }

    return (
      <userContext.Provider value={value}>
      <main style={styles.app}>
        <Routes>
          <Route exact path='/' element={<Landing />} />
          <Route element={<HeaderSkip />}>
            <Route path='/problems' element={<Problems />}  />
            <Route path='/user/:userName' element={<User />} />
            { this.verifyAdmin() == true
            ? <Route path='/create' element={<Create />}  />
            : <Route path='/create' element={<Error />}  />
            }
            <Route path='/problems/:problemName' element={<Question />} />
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      </main>
      </userContext.Provider>
    );
    }
}

const Root = () => <Router><App /></Router>;

export default Root;