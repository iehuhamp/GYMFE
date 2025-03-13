import { Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Auth from "./pages/auth";
import Dashboard from "./pages/dashboard";
import Layout from "./pages/layout";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              {" "}
              <Home />{" "}
            </Layout>
          }
        />
        <Route
          path="/auth"
          element={
            <Layout>
              {" "}
              <Auth />{" "}
            </Layout>
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<div> Page not found </div>} />
      </Routes>
    </>
  );
}

export default App;
