import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <main className="container" style={{ padding: '96px 24px', textAlign: 'center' }}>
      <h1 style={{ fontSize: 'var(--display-lg)' }}>Stránka nenalezena</h1>
      <p style={{ color: 'var(--text-muted)', margin: '16px auto 32px', maxWidth: '46ch' }}>
        Tuto stránku se nám nepodařilo najít. Vraťte se prosím na úvod, nebo nám rovnou napište poptávku.
      </p>
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button href="/" size="lg">Zpět na úvod</Button>
        <Button href="/kontakt" size="lg" variant="secondary">Kontakt</Button>
      </div>
    </main>
  );
}
