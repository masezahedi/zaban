import React from 'react';
import { BookOpenCheck, Brain, Trophy } from 'lucide-react';
import { UserProgress } from '../../db/db';

interface DashboardStatsProps {
  progress: UserProgress[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ progress }) => {
  const stats = [
    { 
      icon: <BookOpenCheck className="w-6 h-6 text-primary-500" />, 
      label: 'کلمات آموخته شده', 
      value: progress.reduce((sum, p) => sum + p.wordsLearned, 0) 
    },
    { 
      icon: <Brain className="w-6 h-6 text-secondary-500" />, 
      label: 'روزهای پیاپی', 
      value: 7 
    },
    { 
      icon: <Trophy className="w-6 h-6 text-accent-500" />, 
      label: 'امتیاز کل', 
      value: progress.reduce((sum, p) => sum + p.points, 0) 
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="card flex items-center space-x-4 space-x-reverse">
          <div className="bg-primary-50 p-3 rounded-lg">
            {stat.icon}
          </div>
          <div>
            <p className="text-gray-600 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;