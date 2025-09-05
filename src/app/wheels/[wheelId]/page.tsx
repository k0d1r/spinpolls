'use client';

import { WheelDisplay } from '@/components/wheels/WheelDisplay';
import { use } from 'react';

interface WheelPageProps {
  params: Promise<{
    wheelId: string;
  }>;
}

export default function WheelPage({ params }: WheelPageProps) {
  const { wheelId } = use(params);
  return <WheelDisplay wheelId={wheelId} />;
}
