export default function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}