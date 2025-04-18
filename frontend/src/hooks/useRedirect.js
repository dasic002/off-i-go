import axios from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export const useRedirect = (userAuthStatus) => {
  const history = useHistory();

  useEffect(() => {
    const handleMount = async () => {
      try {
        await axios.post("/dj-rest-auth/token/refresh/");
        // if user is logged in, the code below will run
        if (userAuthStatus === "loggedIn") {
          history.push("/discover");
        }
      } catch (err) {
        // if user is not logged in, the code below will run
        if (userAuthStatus === "loggedOut") {
          history.push("/signin");
        }
      }
    };
    handleMount();
  }, [history, userAuthStatus]);
};
