import React from 'react';
import { Coffee, Brain, Languages } from 'lucide-react';

const DailyChallenges: React.FC = () => {
  const challenges = [
    { 
      title: 'مرور روزانه', 
      description: '۱۰ کلمه را مرور کنید', 
      progress: 30, 
      icon: <Coffee className="w-6 h-6 text-primary-500" /> 
    },
    { 
      title: 'یادگیری کلمات جدید', 
      description: '۵ کلمه جدید یاد بگیرید', 
      progress: 60, 
      icon: <Brain className="w-6 h-6 text-secondary-500" /> 
    },
    { 
      title: 'تمرین تلفظ', 
      description: '۳ جمله را تلفظ کنید', 
      progress: 0, 
      icon: <Languages className="w-6 h-6 text-accent-500" /> 
    }
  ];

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-gray-900 mb-6">چالش‌های امروز</h2>
      
      <div className="space-y-4">
        {challenges.map((challenge, index) => (
          <div key={index} className="border border-gray-100 rounded-lg p-4 hover:border-primary-200 transition-colors">
            <div className="flex items-center space-x-3 space-x-reverse mb-2">
              {challenge.icon}
              <div>
                <h3 className="font-bold text-gray-900">{challenge.title}</h3>
                <p className="text-sm text-gray-600">{challenge.description}</p>
              </div>
            </div>
            
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${challenge.progress > 0 ? 'bg-primary-500' : 'bg-gray-300'}`}
                  style={{ width: `${challenge.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-600">
                <span>{challenge.progress}%</span>
                <span>
                  {challenge.progress === 100 ? 'کامل شد!' : 
                   challenge.progress > 0 ? 'در حال انجام' : 'شروع نشده'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyChallenges;