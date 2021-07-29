import { Form, FormControl, Button } from "react-bootstrap";
import { doesUsernameExist } from "../../services/firebase";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { FieldValue } from "../../firebaseconfig";

const EmailRegister = (props, dispatch, invalidateCategory) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [fullName, setFullName] = useState("");
  const [errors, setErrors] = useState("");
  const [valid, setValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const isInvalid =
    password === "" ||
    emailAddress === "" ||
    name.length < 3 ||
    fullName === "" ||
    loading ||
    name.indexOf(" ") >= 0;
  const auth = props.auth;
  const [value] = useDebounce(name, 800);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const usernameExists = await doesUsernameExist(name);
    if (usernameExists) {
      setErrors("Username already exists. Try another!");
      setLoading(false);
    } else {
      try {
        const createdUserResult = await auth.createUserWithEmailAndPassword(
          emailAddress,
          password
        );

        const picArray = [
          "https://firebasestorage.googleapis.com/v0/b/prose-pen.appspot.com/o/profileImages%2Fdefaults%2Fprofiler2.png?alt=media&token=e70bdb1c-91a4-4c66-b612-7a86637ebe40",
          "https://firebasestorage.googleapis.com/v0/b/prose-pen.appspot.com/o/profileImages%2Fdefaults%2Fprofiler3.png?alt=media&token=f1f2a8c8-de1e-417d-8cac-a0d48ad2f7ba",
          "https://firebasestorage.googleapis.com/v0/b/prose-pen.appspot.com/o/profileImages%2Fdefaults%2Fprofiler4.png?alt=media&token=b1aa5988-8489-4020-b514-c8e3fb557da4",
          "https://firebasestorage.googleapis.com/v0/b/prose-pen.appspot.com/o/profileImages%2Fdefaults%2Fprofiler5.png?alt=media&token=806d2578-fbc5-41bc-b1be-4e4f7cfb49e9",
        ];
        let pic = picArray[Math.floor(Math.random() * picArray.length)];
        await props.firebase
          .firestore()
          .collection("users")
          .add({
            following: [createdUserResult.user.uid],
            followers: [],
            userId: createdUserResult.user.uid,
            username: name.toLowerCase().trim(),
            fullName,
            emailAddress: emailAddress.toLowerCase(),
            dateCreated: FieldValue.serverTimestamp(),
            picture: pic,
          });
        dispatch(invalidateCategory());
      } catch (error) {
        setErrors(error.message);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      setValid(await doesUsernameExist(value));
    }
    fetchData();
  }, [value]);

  return (
    <>
      <div className="row justify-content-center ">
        <small>
          Already have an account?{" "}
          <Button
            className="pt-0 px-0"
            variant="link"
            onClick={() => props.setLogin(true)}
          >
            <small>Sign In</small>
          </Button>
        </small>
      </div>
      <hr className="mt-1" />
      <Form onSubmit={handleSubmit} method="post">
        <Form.Group>
          <Form.Label className="small">Username</Form.Label>
          <FormControl
            value={name}
            isValid={name.trim().length > 2 && valid === false}
            isInvalid={(name && valid === true) || name.indexOf(" ") >= 0}
            id="username"
            placeholder="prosewriter"
            name="username"
            onChange={({ target }) => setName(target.value)}
            type="text"
            maxLength={12}
            spellCheck={false}
          />
        </Form.Group>
        <Form.Group>
        <Form.Label className="small">Full Name</Form.Label>
          <FormControl
            id="full name"
            value={fullName}
            onChange={({ target }) => setFullName(target.value)}
            placeholder="Jane Doe"
            type="text"
            spellCheck={false}
            maxLength={30}
          />
        </Form.Group>
        <Form.Group>
        <Form.Label className="small">E-mail</Form.Label>
          <FormControl
            id="email"
            value={emailAddress}
            onChange={({ target }) => setEmailAddress(target.value)}
            placeholder="janedoe@email.com"
            type="email"
          />
        </Form.Group>

        <Form.Group>
        <Form.Label className="small">Password</Form.Label>
          <FormControl
            id="password"
            value={password}
            placeholder="Password"
            type="password"
            name="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </Form.Group>

        {errors && (
          <Form.Group>
            <small className="text-danger mx-auto">{errors}</small>
          </Form.Group>
        )}
        <div>
          <Button disabled={isInvalid} style={{ width: "100%" }} type="submit">
            {loading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              <span>Sign Up</span>
            )}
          </Button>
        </div>
      </Form>
    </>
  );
};

export default EmailRegister;
