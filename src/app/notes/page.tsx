import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function NotesPage() {
  const posts = getAllPosts();

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Notes</h1>
        <p className="text-muted-foreground">
          Debug stories, tutorials, build logs — short and practical.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {posts.map((p) => (
          <Link key={p.slug} href={`/notes/${p.slug}`}>
            <Card className="rounded-2xl transition hover:shadow-sm">
              <CardHeader className="space-y-1">
                <h2 className="text-lg font-semibold">{p.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {p.date} • {p.readingTime}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{p.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}