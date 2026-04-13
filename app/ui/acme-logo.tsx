import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div className={`${lusitana.className} flex items-center gap-2 text-white text-xl font-bold`}>
      <GlobeAltIcon className="h-6 w-6" />
      Go Fly
    </div>
  );
}