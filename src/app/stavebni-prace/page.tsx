import type { Metadata } from 'next';
import { ServicePage } from '@/components/layout/ServicePage';
import { getService } from '@/content/services';

const service = getService('stavebni-prace')!;
export const metadata: Metadata = { title: service.title, description: service.seoDescription };
export default function Page() { return <ServicePage service={service} />; }
