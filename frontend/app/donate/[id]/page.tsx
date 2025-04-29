import { DonateForm } from "./DonateForm";

export default async function DonatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-4">
          Donate to Project {(await params).id}
        </h1>
        <div className="bg-white/5 rounded-xl p-6">
          <DonateForm projectId={(await params).id} />
        </div>
      </div>
    </div>
  );
}
