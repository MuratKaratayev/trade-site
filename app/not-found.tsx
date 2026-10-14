import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section">
      <div className="container-site flex flex-col items-start gap-6">
        <span className="t-label">Ошибка 404</span>
        <h1 className="t-display">Страница не найдена</h1>
        <p className="t-body-l text-muted">Возможно, адрес изменился после обновления сайта.</p>
        <Link href="/" className="btn btn-primary">
          На главную
        </Link>
      </div>
    </section>
  );
}
