import { useRouter } from "next/router";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { auth, firestore } from "../../lib/firebase";
import AuthCheck from "../../components/AuthCheck";
import { useState } from "react";
import styles from "../../styles/Admin.module.css";
import Link from "next/link";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { serverTimestamp } from "../../lib/firebase";
import toast from "react-hot-toast";
import ImageUploader from "../../components/ImageUploader";
import Metatags from "../../components/Metatags";

export default function AdminPostEdit(props) {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);

  let router = useRouter();
  let { slug } = router.query;

  let ref = firestore
    .collection("users")
    .doc(auth.currentUser.uid)
    .collection("posts")
    .doc(slug);

  let [post] = useDocumentData(ref);

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm postRef={ref} defaultValues={post} preview={preview} />
          </section>

          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>
              {preview ? "Edit" : "Preview"}
            </button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Live view</button>
            </Link>
          </aside>
        </>
      )}
    </main>
  );
}

function PostForm({ postRef, defaultValues, preview }) {
  const { register, handleSubmit, reset, watch, formState } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const { isDirty, isValid, errors } = formState;

  const updatePost = async ({ content, published }) => {
    await postRef.update({
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success("Post updated successfully!");
  };

  return (
    <>
      <Metatags title="Edit" />
      <form onSubmit={handleSubmit(updatePost)}>
        {preview && (
          <div className="card">
            <ReactMarkdown>{watch("content")}</ReactMarkdown>
          </div>
        )}

        <div className={preview ? styles.hidden : styles.controls}>
          <ImageUploader />

          <textarea
            name="content"
            {...register("content", {
              maxLength: { value: 20000, message: "content is too long" },
              minLength: { value: 10, message: "content is too short" },
              required: { value: true, message: "content is required" },
            })}
          ></textarea>

          {errors.content && (
            <p className="text-danger">{errors.content.message}</p>
          )}

          <fieldset>
            <input
              type="checkbox"
              className={styles.checkbox}
              name="published"
              {...register("published")}
            />
            <label>Published</label>
          </fieldset>

          <button
            type="submit"
            className="btn-green"
            disabled={!isDirty || !isValid}
          >
            Save Changes
          </button>
        </div>
      </form>
    </>
  );
}
