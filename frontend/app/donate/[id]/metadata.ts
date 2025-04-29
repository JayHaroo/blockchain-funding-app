import { Metadata } from 'next';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `Donate to Project ${params.id}`,
    description: 'Support this project through blockchain donations',
  };
} 