import { Switch, Route, useLocation } from "react-router-dom";
import { Provider } from "./context";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Sub from "./pages/Sub";
import Post from "./pages/SinglePost";
import Submit from "./pages/CreatePost";
import UserProfile from "./pages/UserProfile";
import CreateSub from "./pages/CreateSub";

function App() {
  const authRoutes = ["/register", "/login"];
  const location = useLocation();
  const authRoute = authRoutes.includes(location.pathname);

  return (
    <Provider>
      {!authRoute && <Navbar />}
      <div className={authRoute ? "" : "pt-12"}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route exact path="/r/:subname" component={Sub} />
          <Route path="/r/:subname/:id/:postname" component={Post} />
          <Route path="/r/:subname/submit" component={Submit} />
          <Route path="/u/:username" component={UserProfile} />
          <Route path="/subs/create" component={CreateSub} />
        </Switch>
      </div>
    </Provider>
  );
}

export default App;
