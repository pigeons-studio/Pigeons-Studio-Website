import World from '@/app/components/world/World';

export default function MondeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <World />
      {children}
    </>
  );
}
