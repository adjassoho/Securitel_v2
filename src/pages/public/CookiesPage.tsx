import CookieSettings from '@/components/ui/CookieSettings';

const CookiesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CookieSettings />
      </div>
    </div>
  );
};

export default CookiesPage;