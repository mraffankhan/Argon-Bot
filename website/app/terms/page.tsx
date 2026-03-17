import PolicyPage from "@/components/PolicyLayout";

export default function Terms() {
  const content = (
    <>
      <section className="space-y-4">
        <h2 className="text-3xl font-bold uppercase italic tracking-tight">1. Agreement to Terms</h2>
        <p className="text-lg leading-relaxed font-medium">
          By accessing or using Argon, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-bold uppercase italic tracking-tight">2. User Responsibilities</h2>
        <ul className="list-disc pl-6 space-y-3 font-medium">
          <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
          <li>You agree not to use the service for any illegal or unauthorized purpose.</li>
          <li>You must not transmit any worms, viruses, or any code of a destructive nature.</li>
          <li>Violation of any terms will result in an immediate termination of your Services.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-bold uppercase italic tracking-tight">3. Service Modifications</h2>
        <p className="text-lg leading-relaxed font-medium">
          We reserve the right to modify or discontinue the service at any time without notice. We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the service.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-bold uppercase italic tracking-tight">4. Limitation of Liability</h2>
        <p className="text-lg leading-relaxed font-medium">
          In no event shall Argon be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
        </p>
      </section>
    </>
  );

  return <PolicyPage title="Terms of Service" content={content} />;
}
