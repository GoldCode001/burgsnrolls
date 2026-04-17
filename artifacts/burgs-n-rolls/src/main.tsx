import { createRoot } from "react-dom/client";
import { Router, Route, Switch } from "wouter";
import App from "./App";
import AuthorPage from "./pages/AuthorPage";
import "./index.css";

const basePath = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";

createRoot(document.getElementById("root")!).render(
  <Router base={basePath}>
    <Switch>
      <Route path="/author" component={AuthorPage} />
      <Route component={App} />
    </Switch>
  </Router>
);
