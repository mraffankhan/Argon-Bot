import PolicyPage from "@/components/PolicyLayout";

export default function Privacy() {
  const content = (
    <>
      <section className="space-y-4">
        <h2 className="text-3xl font-bold uppercase italic tracking-tight">1. Data Collection</h2>
        <p className="text-lg leading-relaxed font-medium">
          We collect information you provide directly to us when you create an account, use our Discord bot, or communicate with us. This includes your Discord ID, username, email, and any tournament metadata.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-bold uppercase italic tracking-tight">2. Use of Information</h2>
        <p className="text-lg leading-relaxed font-medium">
          We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect Argon and our users.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-bold uppercase italic tracking-tight">3. Data Sharing</h2>
        <p className="text-lg leading-relaxed font-medium">
          We do not share your personal information with companies, organizations, or individuals outside of Argon except in cases of legal requirement or with your explicit consent.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-bold uppercase italic tracking-tight">4. Security</h2>
        <p className="text-lg leading-relaxed font-medium">
          We work hard to protect Argon and our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold.
        </p>
      </section>
    </>
  );

  return <PolicyPage title="Privacy Policy" content={content} />;
}
