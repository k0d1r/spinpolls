'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createWheel } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, X, Trash2 } from 'lucide-react';

interface WheelSegment {
  id: string;
  text: string;
  color: string;
  probability: number;
}

const colors = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
  '#F97316', '#6366F1', '#14B8A6', '#F43F5E'
];

export const WheelForm: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [segments, setSegments] = useState<WheelSegment[]>([
    { id: '1', text: '', color: colors[0], probability: 0.5 },
    { id: '2', text: '', color: colors[1], probability: 0.5 }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addSegment = () => {
    const newId = (segments.length + 1).toString();
    const colorIndex = segments.length % colors.length;
    const equalProbability = 1 / (segments.length + 1);
    
    const newSegments = segments.map(segment => ({
      ...segment,
      probability: equalProbability
    }));
    
    setSegments([
      ...newSegments,
      { id: newId, text: '', color: colors[colorIndex], probability: equalProbability }
    ]);
  };

  const removeSegment = (id: string) => {
    if (segments.length > 2) {
      const newSegments = segments.filter(segment => segment.id !== id);
      const equalProbability = 1 / newSegments.length;
      
      setSegments(newSegments.map(segment => ({
        ...segment,
        probability: equalProbability
      })));
    }
  };

  const updateSegment = (id: string, field: keyof WheelSegment, value: string | number) => {
    setSegments(segments.map(segment => 
      segment.id === id ? { ...segment, [field]: value } : segment
    ));
  };

  const normalizeProbabilities = () => {
    const total = segments.reduce((sum, segment) => sum + segment.probability, 0);
    if (total > 0) {
      setSegments(segments.map(segment => ({
        ...segment,
        probability: segment.probability / total
      })));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to create a wheel');
      return;
    }

    if (!title.trim()) {
      setError('Wheel title is required');
      return;
    }

    const validSegments = segments.filter(segment => segment.text.trim());
    if (validSegments.length < 2) {
      setError('At least 2 segments are required');
      return;
    }

    // Normalize probabilities
    const total = validSegments.reduce((sum, segment) => sum + segment.probability, 0);
    const normalizedSegments = validSegments.map(segment => ({
      ...segment,
      probability: total > 0 ? segment.probability / total : 1 / validSegments.length
    }));

    try {
      setLoading(true);
      setError('');

      const wheelId = await createWheel({
        title: title.trim(),
        description: description.trim() || undefined,
        segments: normalizedSegments.map(segment => ({
          id: segment.id,
          text: segment.text.trim(),
          color: segment.color,
          probability: segment.probability,
          spins: 0
        })),
        createdBy: user.uid,
        isActive: true,
      });

      router.push(`/wheels/${wheelId}`);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Çark Oluştur</h1>
          <p className="text-gray-600">Özel bölümlerle etkileşimli dönen çark oluşturun</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Çark Başlığı"
            placeholder="Bu çark ne için?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama (İsteğe Bağlı)
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Çarkınız hakkında daha fazla bilgi ekleyin..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Çark Bölümleri
            </label>
            <div className="space-y-4">
              {segments.map((segment, index) => (
                <div key={segment.id} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                  <div
                    className="w-6 h-6 rounded-full flex-shrink-0"
                    style={{ backgroundColor: segment.color }}
                  />
                  <Input
                    placeholder={`Bölüm ${index + 1}`}
                    value={segment.text}
                    onChange={(e) => updateSegment(segment.id, 'text', e.target.value)}
                    className="flex-1"
                  />
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600">Weight:</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={Math.round(segment.probability * 100)}
                      onChange={(e) => updateSegment(segment.id, 'probability', parseFloat(e.target.value) / 100)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                  {segments.length > 2 && (
                    <Button
                      type="button"
                      onClick={() => removeSegment(segment.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2 mt-4">
              <Button
                type="button"
                onClick={addSegment}
                variant="outline"
                className="flex-1"
              >
                <Plus className="w-4 h-4 mr-2" />
                Bölüm Ekle
              </Button>
              <Button
                type="button"
                onClick={normalizeProbabilities}
                variant="outline"
                className="flex-1"
              >
                Normalize Weights
              </Button>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Oluşturuluyor...' : 'Çark Oluştur'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
