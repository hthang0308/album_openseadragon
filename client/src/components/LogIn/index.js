import { useRef } from "react";
import { post } from "../../utils/ApiCaller";
//local storage
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import LocalStorageUtils from "../../utils/LocalStorageUtils";
import { useNavigate } from "react-router-dom";
export default function LogIn(props) {
  const navigate = useNavigate();
  const notify = (message) => toast(message);
  //return form login with width=50% screen
  const username = useRef();
  const password = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      username: username.current.value,
      password: password.current.value,
    };
    post("/user/login", data)
      .then((res) => {
        //f5
        window.location.reload();
        // navigate("/");
        // notify(res.data.message);
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };

  return (
    <form className="mt-5 w-25 mx-auto" onSubmit={handleSubmit}>
      <div class="form-outline mb-4">
        <label>Username</label>
        <input type="text" class="form-control" ref={username} />
      </div>

      <div class="form-outline mb-4">
        <label>Password</label>
        <input type="password" class="form-control" ref={password} />
      </div>

      <button type="submit" class="btn btn-primary btn-block mb-4">
        Sign in
      </button>

      <div class="text-center">
        <p>
          Not a member? <a href="/#/sign-up">Sign up</a>
        </p>
      </div>
    </form>
  );
}
