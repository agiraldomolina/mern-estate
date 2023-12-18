import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";


export default function PrivateRoute() {
    const {currentUser} = useSelector(state => state.user) // in userSlice.js we create a selector that returns the state of the user
  return currentUser? <Outlet /> : <Navigate to="/sign-in" />;
}
