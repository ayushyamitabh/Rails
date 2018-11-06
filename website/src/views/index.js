import Home from './Home/Home';
import DashboardHome from './DashboardHome/DashboardHome';
import Signin from './Signin/Signin';
import Signup from './Signup/Signup';
import { ProtectedJoinClass, JoinClass } from './JoinClass/JoinClass';
import { CreateClass, ProtectedCreateClass } from './CreateClass/CreateClass';
import NotFound from './NotFound/NotFound';
import { ProtectedDashboardRouter, DashboardRouter } from './DashboardRouter/DashboardRouter';

export {
  Home, Signin, Signup, CreateClass, DashboardHome, NotFound, DashboardRouter, JoinClass,
  ProtectedCreateClass, ProtectedDashboardRouter, ProtectedJoinClass,
};
