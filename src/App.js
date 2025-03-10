import {Route, Switch, Redirect} from 'react-router-dom'
import Login from './components/Login'
import ProtectRoute from './components/ProtectRoute'
import Home from './components/Home'
import Jobs from './components/Jobs'
import JobItemDetails from './components/JobItemDetails'

import NotFound from './components/NotFound'

import './App.css'

const App = () => (
  <>
    <div className="main-container">
      <Switch>
        <Route exact path="/login" component={Login} />
        <ProtectRoute exact path="/" component={Home} />
        <ProtectRoute exact path="/jobs" component={Jobs} />
        <ProtectRoute exact path="/jobs/:id" component={JobItemDetails} />
        <Route exact path="/not-found" component={NotFound} />
        <Redirect to="/not-found" />
      </Switch>
    </div>
  </>
)

export default App
