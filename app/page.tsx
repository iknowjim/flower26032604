'use client';

import { useState } from 'react';

export default function PlantDiseaseAI() {
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const recognize = async () => {
    const fileInput = document.getElementById('file') as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) return setError('请上传照片');

    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/proxy', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || '识别失败');
      setResult(data);
    } catch (err: any) {
      setError(err.message || '请求失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-10">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-emerald-600 text-white p-8 text-center">
          <h1 className="text-3xl font-bold">🌺 AI花卉病虫害识别</h1>
          <p className="mt-2 opacity-90">月季 · 铁线莲 · 多肉 等专用</p>
        </div>

        <div className="p-8">
          <div 
            onClick={() => document.getElementById('file')?.click()}
            className="border-2 border-dashed border-emerald-300 rounded-3xl p-12 text-center cursor-pointer hover:border-emerald-500 transition-all"
          >
            <input id="file" type="file" accept="image/*" capture="camera" className="hidden" onChange={handleFile} />
            <div className="mx-auto w-24 h-24 bg-emerald-100 rounded-3xl flex items-center justify-center text-6xl mb-4">📸</div>
            <p className="text-xl font-medium text-emerald-700">点击上传花卉照片</p>
            <p className="text-sm text-gray-500 mt-3">叶片或病斑清晰效果更好</p>
          </div>

          {preview && (
            <div className="mt-6 rounded-3xl overflow-hidden shadow">
              <img src={preview} alt="预览" className="w-full" />
            </div>
          )}

          <button 
            onClick={recognize}
            disabled={loading}
            className="w-full mt-8 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-3xl text-lg transition"
          >
            {loading ? 'AI正在诊断中...' : '🚀 开始识别病虫害'}
          </button>

          {error && <p className="mt-4 text-red-600 text-center font-medium">{error}</p>}

          {result && result.results && (
            <div className="mt-8 bg-emerald-50 rounded-3xl p-6">
              <h3 className="font-bold text-emerald-700 mb-4">🔍 识别结果</h3>
              {result.results.slice(0, 5).map((item: any, i: number) => {
                const score = (item.score * 100).toFixed(1);
                const name = item.species?.scientificName || '未知病害';
                return (
                  <div key={i} className="bg-white p-4 rounded-2xl mb-3 shadow-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">{name}</span>
                      <span className="text-emerald-600 font-semibold">{score}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
