'use client';

import { useState, useEffect, useRef } from 'react';
import { getWheel, spinWheel, subscribeToWheel } from '@/lib/database';
import { Wheel } from '@/types';
import { Button } from '@/components/ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Share2, Copy, Check, RotateCcw } from 'lucide-react';

interface WheelDisplayProps {
  wheelId: string;
}

export const WheelDisplay: React.FC<WheelDisplayProps> = ({ wheelId }) => {
  const [wheel, setWheel] = useState<Wheel | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const unsubscribe = subscribeToWheel(wheelId, (wheelData) => {
      setWheel(wheelData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [wheelId]);

  useEffect(() => {
    if (wheel && canvasRef.current) {
      drawWheel();
    }
  }, [wheel]);

  const drawWheel = () => {
    if (!wheel || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw wheel segments
    let currentAngle = 0;
    wheel.segments.forEach((segment) => {
      const segmentAngle = segment.probability * 2 * Math.PI;
      
      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + segmentAngle);
      ctx.closePath();
      ctx.fillStyle = segment.color;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      const textAngle = currentAngle + segmentAngle / 2;
      const textX = centerX + Math.cos(textAngle) * (radius * 0.7);
      const textY = centerY + Math.sin(textAngle) * (radius * 0.7);
      
      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(textAngle + Math.PI / 2);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(segment.text, 0, 0);
      ctx.restore();

      currentAngle += segmentAngle;
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw pointer
    ctx.beginPath();
    ctx.moveTo(centerX + radius + 10, centerY);
    ctx.lineTo(centerX + radius + 30, centerY - 10);
    ctx.lineTo(centerX + radius + 30, centerY + 10);
    ctx.closePath();
    ctx.fillStyle = '#ef4444';
    ctx.fill();
  };

  const spin = async () => {
    if (!wheel || isSpinning) return;

    try {
      setIsSpinning(true);
      setResult(null);

      // Calculate random result based on probabilities
      const random = Math.random();
      let cumulativeProbability = 0;
      let selectedSegment = wheel.segments[0];

      for (const segment of wheel.segments) {
        cumulativeProbability += segment.probability;
        if (random <= cumulativeProbability) {
          selectedSegment = segment;
          break;
        }
      }

      // Calculate rotation
      const segmentAngle = selectedSegment.probability * 2 * Math.PI;
      const segmentStartAngle = wheel.segments
        .slice(0, wheel.segments.indexOf(selectedSegment))
        .reduce((sum, seg) => sum + seg.probability * 2 * Math.PI, 0);
      
      const targetAngle = segmentStartAngle + segmentAngle / 2;
      const spins = 5 + Math.random() * 5; // 5-10 full rotations
      const finalRotation = spins * 2 * Math.PI - targetAngle;

      // Animate rotation
      const startRotation = rotation;
      const startTime = Date.now();
      const duration = 3000; // 3 seconds

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentRotation = startRotation + (finalRotation - startRotation) * easeOut;
        
        setRotation(currentRotation);
        
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(currentRotation);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
            drawWheel();
            ctx.restore();
          }
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setResult(selectedSegment.text);
          // Record the spin
          spinWheel(wheelId, selectedSegment.id).catch(console.error);
        }
      };

      animate();
    } catch (error) {
      console.error('Error spinning wheel:', error);
    } finally {
      setIsSpinning(false);
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

  if (!wheel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Wheel not found</h1>
          <p className="text-gray-600">This wheel may have been deleted or doesn't exist.</p>
        </div>
      </div>
    );
  }

  const chartData = wheel.segments.map(segment => ({
    name: segment.text,
    spins: segment.spins,
    color: segment.color
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{wheel.title}</h1>
            {wheel.description && (
              <p className="text-lg text-gray-600 mb-6">{wheel.description}</p>
            )}
            
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span>{wheel.totalSpins} spins</span>
              <span>•</span>
              <span>Created {new Date(wheel.createdAt).toLocaleDateString()}</span>
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

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Wheel */}
            <div className="text-center">
              <div className="relative inline-block">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  className="border-4 border-gray-200 rounded-full"
                  style={{ transform: `rotate(${rotation}rad)` }}
                />
                {result && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-blue-500">
                      <p className="text-lg font-semibold text-gray-900">Result:</p>
                      <p className="text-2xl font-bold text-blue-600">{result}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <Button
                onClick={spin}
                disabled={isSpinning}
                size="lg"
                className="mt-6"
              >
                {isSpinning ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Spinning...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Spin the Wheel
                  </>
                )}
              </Button>
            </div>

            {/* Results */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 text-center">Results</h2>
              
              {wheel.totalSpins > 0 ? (
                <>
                  {/* Bar Chart */}
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="spins" fill="#3B82F6" />
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
                          dataKey="spins"
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
                    {wheel.segments.map((segment) => {
                      const percentage = wheel.totalSpins > 0 ? (segment.spins / wheel.totalSpins) * 100 : 0;
                      return (
                        <div key={segment.id} className="flex items-center space-x-4">
                          <div
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: segment.color }}
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium">{segment.text}</span>
                              <span className="text-sm text-gray-600">
                                {segment.spins} spins ({percentage.toFixed(1)}%)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: segment.color
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <RotateCcw className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No spins yet. Be the first to spin the wheel!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
