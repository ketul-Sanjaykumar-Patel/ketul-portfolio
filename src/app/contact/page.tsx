export default function ContactPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Contact</h1>
      <p className="text-muted-foreground">
        Want to collaborate or discuss an embedded/robotics role?
      </p>

      <div className="rounded-2xl border p-5 space-y-2 text-muted-foreground">
        <p>
          Email:{" "}
          <a className="underline" href="mailto:ketulpatel858@gmail.com">
            ketulpatel858@gmail.com
          </a>
        </p>
        <p>
          LinkedIn: <span className="underline">https://www.linkedin.com/in/ketul-patel-kp099/</span>
        </p>
        <p>
          GitHub: <span className="underline">https://github.com/ketulpatel858</span>
        </p>
      </div>
    </div>
  );
}