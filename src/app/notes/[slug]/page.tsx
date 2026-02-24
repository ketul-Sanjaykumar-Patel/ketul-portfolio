import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return notFound();

  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <Link href="/notes" style={{ color: "var(--muted)", fontSize: "0.8rem", letterSpacing: "0.05em" }}>
        ← Back to notes
      </Link>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--text)", margin: "2rem 0 0.5rem", lineHeight: 1.2 }}>
        {post.title}
      </h1>
      <p style={{ color: "var(--accent2)", fontSize: "0.8rem", letterSpacing: "0.06em", marginBottom: "3rem" }}>
        {post.date} · {post.readingTime}
      </p>
      <article className="prose">
        <MDXRemote source={post.source} />
      </article>
    </main>
  );
}