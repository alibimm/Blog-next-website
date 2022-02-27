import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase";
import PostContent from "../../components/PostContent";
import styles from "../../styles/Post.module.css";
import { useDocumentData } from "react-firebase-hooks/firestore";

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  if (userDoc) {
    const postRef = userDoc.ref.collection("posts").doc(slug);
    let postData = await postRef.get();
    if (!postData.data()) {
      return {
        notFound: true,
      };
    }

    post = postToJSON(postData);
    path = postRef.path;
  }

  return {
    props: { post, path },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  const snapshot = await firestore.collectionGroup("posts").get();

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
}

export default function PostFeed(props) {
  const ref = firestore.doc(props.path);
  const [realtimePost] = useDocumentData(ref);
  const post = realtimePost || props.post;

  return (
    <main className={styles.container}>
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0}🤍</strong>
        </p>
      </aside>
    </main>
  );
}
