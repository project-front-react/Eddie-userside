import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import Login from "./pages/authentication/login/Login";
import CreateAccount from "./pages/authentication/createAccount/CreateAccount";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Sidebar from "./components/sidebar/Sidebar";

import ResetPassword from "./pages/authentication/resetPassword/ResetPassword";
import Home from "./pages/Home/Home";
import ForgotPassword from "./pages/authentication/forgotPassword/ForgotPassword";
import Aboutus from "./pages/Aboutus/Aboutus";
import Contactus from "./pages/Contacus/Contactus";
import NewsArticleList from "./pages/NewsArticleList/NewsArticleList";
import BlogDetail from "./pages/BlogDetail/BlogDetail";
import ProfileMain from "./pages/CreateProfile/ProfileMain";
import UserDashboard from "./pages/UserDashboard/UserDashboard";
import MyCourse from "./pages/MyCourse/MyCourse";
import MySpace from "./pages/MySpace/MySpace";
import TermsAndCondition from "./pages/TermsAndCondition/TermsAndCondition";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import ViewAllCourse from "./pages/ViewAllCourse/ViewAllCourse";
import ViewCourseDetails from "./pages/ViewCourseDetails/ViewCourseDetails";
import CheckOut from "./pages/CheckOut/CheckOut";
import EddiLabs from "./pages/EddiLabs/EddiLabs";
import EventList from "./pages/EventList/EventList";
import EventDetails from "./pages/EventDetails/EventDetails";
import { Redirect } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EventCheckOut from "./pages/eventCheckout/eventCheckOut";
import MyProfile from "./pages/MyProfile/MyProfile";
import EditProfile from "./pages/EditProfile/EditProfile";
import MyFavorite from "./pages/MyFavorite/MyFavorite";
import ScrollToTop from "./ScrollToTop";
import Verification from "./components/Verification/Verification";
import Page404 from "./pages/Page404/Page404";
import InstructerProfile from "./pages/InstructerProfile/InstructerProfile";
import CategoryDetails from "./pages/CategoryDetails/CategoryDetails";
import NoInternet from "./pages/NoInternet/NoInternet";
import RecruitmentListing from "./pages/RecruitmentListing/RecruitmentListing";
import OrganizationCourse from "./pages/OrganizationCourse/OrganizationCourse";
import CorporateUserDashboard from "./pages/UserDashboard/CorporateUserDashboard";
import CategorizedCourse from "./pages/CategorizedCourse/CategorizedCourse";
import Overview from "./pages/EddiLabs/Overview";
import WatchCourse from "./pages/EddiLabs/WatchCourse";
import CorporateEventList from "./pages/EventList/CorporateEventList";
import NewsDetails from "./pages/EventDetails/NewsDetails";

function PrivateRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        authed === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
}
const Routing = () => {
  const state = useSelector((state) => state?.Eddi);
  let lan = state?.language;
  const [authed, setAuthed] = useState(
    state?.UserDetail?.Authorization ? true : false
  );

  useEffect(() => {
    setAuthed(state?.UserDetail?.Authorization ? true : false);
  }, [state?.UserDetail?.Authorization]);

  return (
    <Router>
      <ScrollToTop />
      <Switch>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <Route exact path="/home" component={Home} />
        <Route exact path="/category-details/:id" component={CategoryDetails} />
        <Route exact path="/header" component={Header} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/verify-user/:id/:lan" component={Verification} />
        <Route exact path="/create-account" component={CreateAccount} />
        <Route exact path="/resetpassword" component={ResetPassword} />
        <Route exact path="/forgotpassword" component={ForgotPassword} />
        <Route exact path="/about-eddi" component={Aboutus} />
        <Route exact path="/contact-us" component={Contactus} />
        <Route exact path="/news-article" component={NewsArticleList} />
        <Route exact path="/blog-detail/:id" component={BlogDetail} />
        <Route exact path="/sidebar" component={Sidebar} />
        <Route exact path="/404" component={Page404} />
        <Route exact path="/NoInternet" component={NoInternet} />
        <Route exact path="/footer" component={Footer} />
        <Route
          exact
          path="/terms-and-conditions"
          component={TermsAndCondition}
        />
        <Route exact path="/privacy-policy" component={PrivacyPolicy} />

        <PrivateRoute
          authed={authed}
          exact
          path="/user-dashboard"
          component={UserDashboard}
        />      
          <PrivateRoute
          authed={authed}
          exact
          path="/corporate-user-dashboard"
          component={CorporateUserDashboard}
        /> 
           <PrivateRoute
          authed={authed}
          exact
          path="/corporate-user-dashboard/categorized-course"
          component={CategorizedCourse}
        />
        <PrivateRoute
          authed={authed}
          exact
          path="/my-space"
          component={MySpace}
        />
        <PrivateRoute
          authed={authed}
          exact
          path="/my-profile"
          component={MyProfile}
        />
        <PrivateRoute
          authed={authed}
          exact
          path="/edit-profile"
          component={EditProfile}
        />
        <PrivateRoute
          authed={authed}
          exact
          path="/my-favorite"
          component={MyFavorite}
        />
        <PrivateRoute
          authed={authed}
          exact
          path="/organization-course"
          component={OrganizationCourse}
        />
        <PrivateRoute
          authed={authed}
          exact
          path="/view-all-courses"
          component={ViewAllCourse}
        />

        <PrivateRoute
          authed={authed}
          exact
          path="/my-course"
          component={MyCourse}
        />
        <PrivateRoute
          authed={authed}
          exact
          path="/Recruitment-Listing"
          component={RecruitmentListing}
        />
        <PrivateRoute
          authed={authed}
          exact
          path="/instructor-profile"
          component={InstructerProfile}
        />
        <PrivateRoute
          authed={authed}
          exact
          path="/create-profile"
          component={ProfileMain}
        />
        <PrivateRoute
          authed={authed}
          exact
          path="/edit-eddi-profile"
          component={ProfileMain}
        />
        <PrivateRoute
          authed={authed}
          exact
          path="/check-out/:id"
          component={CheckOut}
        />
        <PrivateRoute
          authed={authed}
          exact
          path="/watch-course/:course_id/:module_id"
          component={WatchCourse}
        />  
              <PrivateRoute
          authed={authed}
          exact
          path="/course-overview/:id"
          component={Overview}
        />
        <PrivateRoute
          authed={authed}
          exact
          path="/user-dashboard/event-list"
          component={EventList}
        /> 
          <PrivateRoute
          authed={authed}
          exact
          path="/corporate-user-dashboard/corporate-event-list"
          component={CorporateEventList}
        />
        {/* <Route exact path="/user-dashboard/event-list" component={EventList} /> */}
        <PrivateRoute
          authed={authed}
          exact
          path="/user-dashboard/event-details/:id"
          component={EventDetails}
        />

        <PrivateRoute
          authed={authed}
          exact
          path="/user-dashboard/news-details/:id"
          component={NewsDetails}
        />
        <PrivateRoute
          authed={authed}
          exact
          path="/user-dashboard/event-checkout/:id"
          component={EventCheckOut}
        />
        <PrivateRoute
          authed={authed}
          exact
          path="/view-course-details"
          component={ViewCourseDetails}
        />
        <PrivateRoute
          authed={authed}
          exact
          path="/view-course-details/:id"
          component={ViewCourseDetails}
        />
        <Route path="*" component={Page404} />
      </Switch>
    </Router>
  );
};

export default Routing;
