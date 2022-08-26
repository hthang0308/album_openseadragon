import { useRef } from "react";
import { post } from "../../utils/ApiCaller";
export default function SignUp(props) {
  //return form login with width=50% screen
  const username = useRef();
  const password = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      username: username.current.value,
      password: password.current.value,
    };
    post("/user/signup", data)
      .then((res) => {
        alert(res.data.message);
        //redirect to login page
        window.location.href = "/#/log-in";
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

      {/* <div class="row mb-4">
        <div class="col">
          <a href="#!">Forgot password?</a>
        </div>
      </div> */}

      <button type="submit" class="btn btn-primary btn-block mb-4">
        Sign up
      </button>

      <div class="text-center">
        <p>
          Already a member? <a href="/#/log-in">Log in</a>
        </p>
      </div>
    </form>
  );
}
