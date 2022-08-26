import { useRef } from "react";
import { put } from "../../utils/ApiCaller";
export default function AllUsers(props) {
  //return form login with width=50% screen
  const currentPassword = useRef();
  const newPassword = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      currentPassword: currentPassword.current.value,
      newPassword: newPassword.current.value,
    };
    put("/user/change-password", data)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <form className="mt-5 w-25 mx-auto" onSubmit={handleSubmit}>
      <div class="form-outline mb-4">
        <label>Current Password</label>
        <input type="password" class="form-control" ref={currentPassword} />
      </div>
      <div class="form-outline mb-4">
        <label>New Password</label>
        <input type="password" class="form-control" ref={newPassword} />
      </div>

      {/* <div class="row mb-4">
        <div class="col">
          <a href="#!">Forgot password?</a>
        </div>
      </div> */}

      <button type="submit" class="btn btn-primary btn-block mb-4">
        Submit
      </button>
    </form>
  );
}
