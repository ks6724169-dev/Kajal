import React from 'react';
import { Sun, CloudRain, CloudLightning, Wind, Thermometer, MapPin } from 'lucide-react';
import { Tenant } from '../../types';

interface WeatherWidgetProps {
  tenant: Tenant;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ tenant }) => {
  // Mock weather state customized by location city
  const city = tenant.city || 'New Delhi';
  const getWeatherData = () => {
    if (city.toLowerCase().includes('delhi')) {
      return {
        temp: '32°C',
        condition: 'Partly Cloudy',
        humidity: '68%',
        wind: '12 km/h',
        aqi: '142 (Moderate)',
        advisory: 'Standard transit operations active. All outdoor physical activities cleared.',
        icon: <Sun className="w-8 h-8 text-amber-500 animate-spin-slow" />
      };
    } else if (city.toLowerCase().includes('mumbai')) {
      return {
        temp: '28°C',
        condition: 'Humid & Rain Showers',
        humidity: '89%',
        wind: '24 km/h',
        aqi: '42 (Good)',
        advisory: 'Rain alerts active on GPS Transit Route #4 and Route #12. Drivers advised: reduce speed by 15%.',
        icon: <CloudRain className="w-8 h-8 text-blue-400" />
      };
    } else {
      return {
        temp: '24°C',
        condition: 'Clear Skies',
        humidity: '45%',
        wind: '8 km/h',
        aqi: '55 (Good)',
        advisory: 'Uptime optimal. Transit routes running normal schedules.',
        icon: <Sun className="w-8 h-8 text-amber-500 animate-spin-slow" />
      };
    }
  };

  const weather = getWeatherData();

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800/40">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <MapPin className="w-3 h-3 text-rose-500" /> Local Campus Weather
        </span>
        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase font-mono tracking-tight">{city}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center shrink-0">
            {weather.icon}
          </div>
          <div>
            <h4 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight leading-none">{weather.temp}</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mt-1.5 uppercase tracking-wide">{weather.condition}</p>
          </div>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-right shrink-0">
          <div>
            <span className="text-[8px] font-bold text-slate-400 uppercase block leading-none">Humid</span>
            <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 font-mono mt-0.5 block">{weather.humidity}</span>
          </div>
          <div>
            <span className="text-[8px] font-bold text-slate-400 uppercase block leading-none">Wind</span>
            <span className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 font-mono mt-0.5 block">{weather.wind}</span>
          </div>
          <div className="col-span-2">
            <span className="text-[8px] font-bold text-slate-400 uppercase block leading-none">AQI Safety</span>
            <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5 block">{weather.aqi}</span>
          </div>
        </div>
      </div>

      {/* Advisory block */}
      <div className="p-2.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100 dark:border-slate-800/40 text-[10px] text-slate-500 dark:text-slate-400 leading-normal font-medium">
        <strong className="text-slate-700 dark:text-slate-300 font-bold block mb-0.5 uppercase tracking-wider">Campus Transit Advisory:</strong>
        {weather.advisory}
      </div>
    </div>
  );
};
