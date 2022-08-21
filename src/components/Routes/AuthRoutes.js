// Dashboard cannot be accessed unless logged in

import { Outlet, Navigate } from "react-router-dom";
import { connect } from "react-redux";

const AuthRoutes = ({authenticated}) => {
  return (
    authenticated ? <Outlet/> : <Navigate to="/login"/>
  );
};

const mapStateToProps = ({ session }) => ({
  authenticated: session.authenticated,
});
export default connect(mapStateToProps)(AuthRoutes);
