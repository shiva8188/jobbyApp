import Cookies from 'js-cookie'
import {Redirect, Route} from 'react-router-dom'

const ProtectRoute = props => {
  const jwtToken = Cookies.get('jwt_token')
  console.log(jwtToken)
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }
  return <Route {...props} />
}
export default ProtectRoute
