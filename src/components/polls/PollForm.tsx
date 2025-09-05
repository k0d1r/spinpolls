'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPoll } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, X, Trash2 } from 'lucide-react';

interface PollOption {
  id: string;
  text: string;
  color: string;
}

const colors = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
];

export const PollForm: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<PollOption[]>([
    { id: '1', text: '', color: colors[0] },
    { id: '2', text: '', color: colors[1] }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addOption = () => {
    const newId = (options.length + 1).toString();
    const colorIndex = options.length % colors.length;
    setOptions([...options, { id: newId, text: '', color: colors[colorIndex] }]);
  };

  const removeOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter(option => option.id !== id));
    }
  };

  const updateOption = (id: string, text: string) => {
    setOptions(options.map(option => 
      option.id === id ? { ...option, text } : option
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to create a poll');
      return;
    }

    if (!title.trim()) {
      setError('Poll title is required');
      return;
    }

    const validOptions = options.filter(option => option.text.trim());
    if (validOptions.length < 2) {
      setError('At least 2 options are required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const pollId = await createPoll({
        title: title.trim(),
        description: description.trim() || undefined,
        options: validOptions.map(option => ({
          id: option.id,
          text: option.text.trim(),
          votes: 0,
          color: option.color
        })),
        createdBy: user.uid,
        isActive: true,
      });

      router.push(`/polls/${pollId}`);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Anket Oluştur</h1>
          <p className="text-gray-600">Kitlelerinizi etkileşimli sorularla etkileyin</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Anket Başlığı"
            placeholder="Ne sormak istiyorsunuz?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama (İsteğe Bağlı)
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-colors"
              placeholder="Anketinize daha fazla bağlam ekleyin..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Anket Seçenekleri
            </label>
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={option.id} className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: option.color }}
                  />
                  <Input
                    placeholder={`Seçenek ${index + 1}`}
                    value={option.text}
                    onChange={(e) => updateOption(option.id, e.target.value)}
                    className="flex-1"
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      onClick={() => removeOption(option.id)}
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
            
            <Button
              type="button"
              onClick={addOption}
              variant="outline"
              className="mt-4 w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Seçenek Ekle
            </Button>
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
              className="flex-1 bg-gradient-to-r from-yellow-400 to-pink-400 text-black hover:from-yellow-300 hover:to-pink-300 font-semibold"
            >
              {loading ? 'Oluşturuluyor...' : 'Anket Oluştur'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
