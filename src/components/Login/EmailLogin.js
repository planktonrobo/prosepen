import { useState } from "react";
import { Form, FormControl, Button } from "react-bootstrap";
import EmailRegister from "./EmailRegister";
import { useDispatch } from "react-redux";
import { invalidateCategory } from "../../redux/actions/posts";
const EmailLogin = (props) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState("");
  const [password, setPassword] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const isInvalid = password === "" || emailAddress === "" || loading;
  const auth = props.auth;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await auth
      .signInWithEmailAndPassword(emailAddress, password)
      .catch((error) => {
        setErrors(error.message);
        setLoading(false);
      });
    dispatch(invalidateCategory());
  };

  const [login, setLogin] = useState(true);

  return (
    <>
      {login ? (
        <>
          <div className="row justify-content-center ">
            <small>
              Need an account?{" "}
              <Button
                className="pt-0 px-0"
                variant="link"
                onClick={() => setLogin(false)}
              >
                <small>Sign Up</small>
              </Button>
            </small>
          </div>
          <hr className="mt-1" />
          <Form onSubmit={handleSubmit} method="post">
            <Form.Group>
              <Form.Label className="small">E-mail</Form.Label>
              <FormControl
                id="email"
                value={emailAddress}
                type="email"
                name="username"
                placeholder="E-mail"
                onChange={({ target }) => setEmailAddress(target.value)}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label className="small">Password</Form.Label>
              <FormControl
                id="password"
                value={password}
                type="password"
                name="password"
                placeholder="Password"
                onChange={({ target }) => setPassword(target.value)}
              />
            </Form.Group>
            {errors && (
              <Form.Group>
                <small className="text-danger mx-auto">{errors}</small>
              </Form.Group>
            )}
            <div>
              <Button
                disabled={isInvalid}
                style={{ width: "100%" }}
                type="submit"
              >
                {loading ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  <span>Sign In</span>
                )}
              </Button>
            </div>
          </Form>{" "}
        </>
      ) : (
        <EmailRegister
          dispatch={dispatch}
          invalidateCategory={invalidateCategory}
          auth={auth}
          firebase={props.firebase}
          setLogin={setLogin}
        />
      )}
    </>
  );
};

export default EmailLogin;
