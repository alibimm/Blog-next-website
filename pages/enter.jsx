import { auth, firestore, googleAuthProvider } from "../lib/firebase";
import SignOutButton from "../components/SignOutButton";
import { UserContext } from "../lib/context";
import { useCallback, useContext, useEffect, useState } from "react";
import debounce from "lodash.debounce";
import Metatags from "../components/Metatags";

export default function EnterPage(props) {
  const { user, username } = useContext(UserContext);

  return (
    <main>
      <Metatags title="Authorisation"/>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}

function SignInButton() {
  const signInWithGoogle = async () => {
    try {
      await auth.signInWithPopup(googleAuthProvider);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src="/google.png" /> Sign in with Google
    </button>
  );
}

function UsernameMessage({username, valid, loading}) {
  if (loading) {
    return <p>Checking...</p>
  } else if (valid) {
    return <p className="text-success">{username} is available.</p>
  } else if (username && !valid) {
    return <p className="text-danger">This username is taken!</p>
  } else {
    return <p></p>
  }
}

function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    let userDoc = firestore.doc(`users/${user.uid}`);
    let usernameDoc = firestore.doc(`usernames/${formValue}`);

    let batch = firestore.batch();
    batch.set(userDoc, {username: formValue, photoURL: user.photoURL, displayName: user.displayName});
    batch.set(usernameDoc, {uid: user.uid});

    await batch.commit();
  };

  const onChange = (e) => {
    const val = e.target.value;
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (val.length < 3) {
      setFormValue(val);
      setValid(false);
      setLoading(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setValid(false);
      setLoading(true);
    }
  };

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        let ref = firestore.doc(`usernames/${username}`);
        const { exists } = await ref.get();
        console.log("Firebase read executed!");
        setValid(!exists);
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    !username && (
      <section>
        <h3>Choose username</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            value={formValue}
            placeholder="myname"
            onChange={onChange}
          />

          <UsernameMessage username={formValue} valid={isValid} loading={loading} />

          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>

          <h3>Debug state</h3>
          <div>
            Username: {formValue} <br />
            Loading: {loading.toString()} <br />
            Valid: {isValid.toString()} <br />
          </div>
        </form>
      </section>
    )
  );
}
