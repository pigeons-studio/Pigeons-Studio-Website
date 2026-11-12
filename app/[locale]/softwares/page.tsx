import { redirect } from 'next/navigation';

// l'ancienne page « softwares » renvoie vers son étage dans le monde de Pigeons Studio
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}?etage=logiciels`);
}
