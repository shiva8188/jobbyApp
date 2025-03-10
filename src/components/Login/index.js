import {Component} from 'react'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: ''}

  componentDidMount() {
    this.onGoHome()
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSetErrorMsg = msg => {
    this.setState({errorMsg: msg})
  }

  onGoHome = () => {
    const {history} = this.props
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      history.replace('/')
    }
  }

  onSubmitData = async event => {
    event.preventDefault()

    const {username, password} = this.state
    const {history} = this.props

    const url = 'https://apis.ccbp.in/login'
    const userDetails = {username, password}

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    const jwtToken = data.jwt_token
    if (response.ok) {
      Cookies.set('jwt_token', jwtToken, {expires: 30})
      history.replace('/')
    } else {
      console.log(data.error_msg)
      this.onSetErrorMsg(data.error_msg)
    }
  }

  render() {
    const {username, password, errorMsg} = this.state

    return (
      <div className="login-container">
        <div className="login-content">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="login-logo"
          />

          <form onSubmit={this.onSubmitData}>
            <label htmlFor="username">USERNAME</label>
            <input
              type="text"
              value={username}
              className="input"
              id="username"
              placeholder="Username"
              onChange={this.onChangeUsername}
            />
            <label htmlFor="password">PASSWORD</label>
            <input
              type="password"
              value={password}
              className="input"
              id="password"
              placeholder="Password"
              onChange={this.onChangePassword}
            />
            <button type="submit" className="login-button">
              Login
            </button>
            <p className="error">{errorMsg}</p>
          </form>
        </div>
      </div>
    )
  }
}
export default Login
