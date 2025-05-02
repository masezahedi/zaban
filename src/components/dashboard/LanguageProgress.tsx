import React from 'react';
import { UserProgress } from '../../db/db';

interface LanguageProgressProps {
  progress: UserProgress[];
}

const LanguageProgress: React.FC<LanguageProgressProps> = ({ progress }) => {
  const languageNames: Record<string, string> = {
    english: 'انگلیسی',
    french: 'فرانسوی',
    spanish: 'اسپانیایی',
    german: 'آلمانی'
  };
  
  const languageFlags: Record<string, string> = {
    english: '🇬🇧',
    french: '🇫🇷',
    spanish: '🇪🇸',
    german: '🇩🇪'
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">پیشرفت زبان‌ها</h2>
      </div>
      
      {progress.length > 0 ? (
        <div className="space-y-6">
          {progress.map((lang, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <span className="text-2xl">{languageFlags[lang.language] || '🌐'}</span>
                  <h3 className="font-bold text-gray-900">{languageNames[lang.language] || lang.language}</h3>
                </div>
                <div className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 border border-gray-200">
                  سطح {lang.level}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>{lang.wordsLearned} کلمه آموخته‌شده</span>
                <span>{lang.points} امتیاز</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary-500 h-2.5 rounded-full" 
                  style={{ width: `${Math.min(lang.wordsLearned, 100)}%` }}
                ></div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button className="btn-primary text-sm py-2 px-4">ادامه یادگیری</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">هنوز هیچ زبانی را شروع نکرده‌اید!</p>
          <button className="btn-primary">افزودن زبان جدید</button>
        </div>
      )}
    </div>
  );
};

export default LanguageProgress;