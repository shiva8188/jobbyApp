import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const {history} = props

  const onDelete = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <>
      <div className="header-container">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="header-image"
          />
        </Link>
        <ul className="header-details">
          <li className="list">
            <Link to="/" className="link list">
              Home
            </Link>
          </li>
          <li className="list">
            <Link to="/jobs" className="link list">
              Jobs
            </Link>
          </li>

          <li>
            <button className="logout-button" onClick={onDelete}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </>
  )
}
export default withRouter(Header)
