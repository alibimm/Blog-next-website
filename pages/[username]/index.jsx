import { getUserWithUsername, postToJSON } from "../../lib/firebase";
import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";
import Metatags from "../../components/Metatags";

export async function getServerSideProps({ query }) {
  const { username } = query;
  let userDoc = await getUserWithUsername(username);

  // JSON serializable
  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();
    const postsQuery = userDoc.ref
      .collection("posts")
      .where("published", "==", true)
      .orderBy("createdAt", "desc")
      .limit(5);
    posts = (await postsQuery.get()).docs.map(postToJSON);
  }

  return { props: { user, posts } };
}

export default function Page({ user, posts }) {
  return (
    <main>
      <Metatags title="Profile"/>
      <UserProfile user={user} />
      <PostFeed posts={posts} admin={false} />
    </main>
  );
}
