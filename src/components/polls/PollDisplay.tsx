'use client';

import { useState, useEffect } from 'react';
import { getPoll, votePoll, subscribeToPoll } from '@/lib/database';
import { Poll } from '@/types';
import { Button } from '@/components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Share2, Copy, Check } from 'lucide-react';

interface PollDisplayProps {
  pollId: string;
}

export const PollDisplay: React.FC<PollDisplayProps> = ({ pollId }) => {
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToPoll(pollId, (pollData) => {
      setPoll(pollData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pollId]);

  const handleVote = async () => {
    if (!selectedOption || !poll || voting) return;

    try {
      setVoting(true);
      await votePoll(pollId, selectedOption);
      setHasVoted(true);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setVoting(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Poll not found</h1>
          <p className="text-gray-600">This poll may have been deleted or doesn't exist.</p>
        </div>
      </div>
    );
  }

  const chartData = poll.options.map(option => ({
    name: option.text,
    votes: option.votes,
    color: option.color
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{poll.title}</h1>
            {poll.description && (
              <p className="text-lg text-gray-600 mb-6">{poll.description}</p>
            )}
            
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span>{poll.totalVotes} votes</span>
              <span>•</span>
              <span>Created {new Date(poll.createdAt).toLocaleDateString()}</span>
            </div>

            <Button
              onClick={copyLink}
              variant="outline"
              className="mt-4"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
          </div>

          {/* Voting Section */}
          {!hasVoted ? (
            <div className="space-y-4 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose your answer:</h2>
              {poll.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedOption === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: option.color }}
                    />
                    <span className="font-medium">{option.text}</span>
                  </div>
                </button>
              ))}
              
              <Button
                onClick={handleVote}
                disabled={!selectedOption || voting}
                className="w-full mt-6"
              >
                {voting ? 'Voting...' : 'Submit Vote'}
              </Button>
            </div>
          ) : (
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                ✓ Thank you for voting!
              </div>
            </div>
          )}

          {/* Results */}
          {poll.totalVotes > 0 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-gray-900 text-center">Results</h2>
              
              {/* Bar Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="votes" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="votes"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Results List */}
              <div className="space-y-3">
                {poll.options.map((option) => {
                  const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
                  return (
                    <div key={option.id} className="flex items-center space-x-4">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: option.color }}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{option.text}</span>
                          <span className="text-sm text-gray-600">
                            {option.votes} votes ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: option.color
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
