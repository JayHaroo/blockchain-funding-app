import { Metadata } from 'next';
import { DonateForm } from './DonateForm';

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Donate to Project ${params.id}`,
  };
}

export default async function DonatePage({ params }: Props) {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-4">
          Donate to Project {params.id}
        </h1>
        <div className="bg-white/5 rounded-xl p-6">
          <DonateForm projectId={params.id} />
        </div>
      </div>
    </div>
  );
}
