/* eslint-disable jsx-a11y/aria-role */
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

// Styles
import "./App.css";

// Components
import Login from "./components/Login";
import NoMatch from "./components/NoMatch";
import PrimarySidebar from "./components/Navigation/PrimarySidebar";
import SecondarySidebar from "./components/Navigation/SecondarySidebar";
import Footer from "./components/Footer";
import Register from "./components/Register";
import Message from "./components/Message";
import Recover from "./components/Recover";
import SuperAdmin from "./components/SuperAdmin";
import User from "./components/User";
import Admin from "./components/Admin";
import Help from "./components/Help";
import EditProfile from "./components/EditProfile";
import ManageUsers from "./components/ManageUsers";
import CreateProject from "./components/CreateProject";
import ViewProjects from "./components/ViewProjects";
import EditProject from "./components/EditProject";
import About from "./components/About";
import Editor from "./components/Editor";
import ImportTypology from "./components/ImportTypology";

// State
import { GlobalContext } from "./store";

const App = () => {
  const [state] = React.useContext(GlobalContext);
  const unverifiedRedirect = <Redirect to={{ pathname: "/email-verification" }} />;
  const nonAuthenticatedRedirect = <Redirect to={{ pathname: "/login" }} />;

  const dashboardRoutes = {
    user: "/user/dashboard",
    admin: "/admin/dashboard",
    superadmin: "/superadmin/dashboard",
  };

  const PrivateRoute = React.memo(({ children, role, ...rest }) => {
    if (!state.token) {
      return nonAuthenticatedRedirect;
    }

    if (!state.token.verified) {
      return unverifiedRedirect;
    }

    if (role) {
      return role === state.token.role ? <Route {...rest} render={() => children} /> : <Route component={NoMatch} />;
    }

    return <Route {...rest} render={() => children} />;
  });

  const BaseRoute = () => {
    if (!state.token) {
      return nonAuthenticatedRedirect;
    }

    if (!state.token.verified) {
      return unverifiedRedirect;
    }
    return <Redirect to={{ pathname: dashboardRoutes[state.token.role] }} />;
  };

  const authRoutes = [
    <Route exact path="/login" component={Login} />,
    <Route exact path="/register" component={Register} />,
    <Route exact path="/email-verification" render={() => <Message isEmailVerification />} />,
    <Route exact path="/recover" component={Recover} />,
    <Route exact path="/recover/sent" render={() => <Message isRecoverPassword />} />,
    <Route exact path="/recover/:recoveryToken" component={Recover} />,
  ];

  const generalRoutes = [
    <Route exact path="/about" component={About} />,
    <PrivateRoute exact path="/help" component={Help} />,
    <PrivateRoute exact path="/edit-profile" component={EditProfile} />,
    <PrivateRoute exact path="/edit-profile/success">
      <Message isSuccessfulEditProfile={true} />
    </PrivateRoute>,
    <PrivateRoute exact path="/view-projects" component={ViewProjects} />,
    <PrivateRoute exact path="/editor/:projectId" component={Editor} />,
  ];

  const userRoutes = [
    <PrivateRoute exact path="/user/dashboard" role="user" component={User} />,
  ];

  const adminRoutes = [
    <PrivateRoute exact path="/admin/dashboard" role="admin" component={Admin} />,
    <PrivateRoute exact path="/admin/create-project" role="admin" component={CreateProject} />,
    <PrivateRoute exact path="/admin/edit-project/:id" role="admin" component={EditProject} />,
  ];

  const superadminRoutes = [
    <PrivateRoute exact path="/superadmin/dashboard" role="superadmin" component={SuperAdmin} />,
    <PrivateRoute exact path="/superadmin/manage-users" role="superadmin" component={ManageUsers} />,
    <PrivateRoute exact path="/superadmin/create-project" role="superadmin" component={CreateProject} />,
    <PrivateRoute exact path="/superadmin/edit-project/:id" role="superadmin" component={EditProject} />,
    <PrivateRoute exact path="/superadmin/import-typology" role="superadmin" component={ImportTypology} />,
  ];

  return (
    <Router>
      <div className="app">
        <div className="app__content">
          <PrimarySidebar />
          <SecondarySidebar />
          <Switch>
            <BaseRoute exact path="/" />
            { authRoutes }
            { generalRoutes }
            { userRoutes }
            { adminRoutes }
            { superadminRoutes }
            <Route component={NoMatch} />
          </Switch>
          <Footer />
        </div>
      </div>
    </Router>
  );
};

export default App;
