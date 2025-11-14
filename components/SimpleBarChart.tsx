import React from 'react';

interface ChartData {
  name: string;
  count: number;
}

const SimpleBarChart: React.FC<{ data: ChartData[] }> = ({ data }) => {
  const maxCount = Math.max(...data.map(item => item.count), 0);

  return (
    <div className="w-full h-[300px] flex items-end justify-around p-4 pt-8">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center h-full w-full group" style={{ flex: 1 }}>
          <div className="relative flex-1 flex items-end w-1/2">
            <div
              className="w-full bg-blue-400 dark:bg-blue-500 rounded-t-md group-hover:bg-blue-500 dark:group-hover:bg-blue-400 transition-colors"
              style={{ height: `${maxCount > 0 ? (item.count / maxCount) * 100 : 0}%` }}
              role="progressbar"
              aria-valuenow={item.count}
              aria-valuemin={0}
              aria-valuemax={maxCount}
              aria-label={item.name}
            >
               <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2 pointer-events-none whitespace-nowrap">
                {item.name}: {item.count}
                <svg className="absolute text-gray-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
                    <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
                </svg>
              </div>
            </div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center break-words">{item.name}</span>
        </div>
      ))}
    </div>
  );
};

export default SimpleBarChart;
