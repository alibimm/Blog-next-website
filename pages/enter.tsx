import { auth, googleAuthProvider } from "../lib/firebase";
import { UserContext } from "../lib/context";
import { useContext } from "react";

export default function EnterPage(props) {
  const { user, username } = useContext(UserContext);

  return (
    <main>
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
      <img src="/google.png"/> Sign in with Google
    </button>
  );
}

function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

function UsernameForm() {
  return null;
}
