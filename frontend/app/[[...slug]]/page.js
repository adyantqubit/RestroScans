'use client';

import dynamic from 'next/dynamic';

const CustomerApp = dynamic(() => import('../../src/CustomerApp'), { ssr: false });

export default function Page() {
  return <CustomerApp />;
}
