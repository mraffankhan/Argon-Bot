import PolicyPage from "@/components/PolicyLayout";

export default function Refund() {
  const content = (
    <>
      <section className="space-y-4">
        <h2 className="text-3xl font-bold uppercase italic tracking-tight">1. Premium Subscriptions</h2>
        <p className="text-lg leading-relaxed font-medium">
          Due to the digital nature of our Premium features, refunds are typically not provided once the subscription benefits have been activated for a billing cycle.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-bold uppercase italic tracking-tight">2. Eligibility for Refund</h2>
        <p className="text-lg leading-relaxed font-medium">
          Refunds may be considered in the following limited circumstances:
        </p>
        <ul className="list-disc pl-6 space-y-3 font-medium">
          <li>Duplicate billing due to a technical error on our part.</li>
          <li>Service outage lasting longer than 48 continuous hours.</li>
          <li>Unintentional subscription renewal within 24 hours of the charge.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-bold uppercase italic tracking-tight">3. Contact for Refund</h2>
        <p className="text-lg leading-relaxed font-medium">
          To request a refund, please open a support ticket on our official Discord server or email us at <a href="mailto:ravonixx.contact@gmail.com" className="text-primary hover:underline">ravonixx.contact@gmail.com</a> with your transaction ID and reason for the request.
        </p>
      </section>
    </>
  );

  return <PolicyPage title="Refund Policy" content={content} />;
}
