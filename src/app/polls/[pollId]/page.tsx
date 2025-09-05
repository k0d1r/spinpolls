'use client';

import { PollDisplay } from '@/components/polls/PollDisplay';
import { use } from 'react';

interface PollPageProps {
  params: Promise<{
    pollId: string;
  }>;
}

export default function PollPage({ params }: PollPageProps) {
  const { pollId } = use(params);
  return <PollDisplay pollId={pollId} />;
}
