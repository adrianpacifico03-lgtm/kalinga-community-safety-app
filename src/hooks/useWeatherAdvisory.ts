import { useEffect, useState } from 'react';
import { PHILIPPINE_CITIES } from '../data/philippinesData';
import type { WeatherAdvisoryState } from '../types/kalinga';

function describeWeatherCode(code: number): string {
  if (code === 0) return 'Clear sky';
  if (code <= 3) return 'Partly cloudy';
  if (code <= 48) return 'Overcast / fog';
  if (code <= 57) return 'Light drizzle';
  if (code <= 67) return 'Rain showers';
  if (code <= 82) return 'Heavy rain showers';
  if (code >= 95) return 'Thunderstorm activity';
  return 'Variable conditions';
}

export function useWeatherAdvisory(cityName: string, isOnline: boolean) {
  const [weather, setWeather] = useState<WeatherAdvisoryState>({
    status: 'idle',
  });

  useEffect(() => {
    if (!isOnline) {
      setWeather({ status: 'offline' });
      return;
    }

    const city =
      PHILIPPINE_CITIES.find(
        (c) => c.name.toLowerCase() === cityName.toLowerCase(),
      ) ?? PHILIPPINE_CITIES[0];

    const controller = new AbortController();
    setWeather({ status: 'loading' });

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current=temperature_2m,precipitation,weather_code,wind_speed_10m&timezone=Asia%2FManila`;

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Weather feed unavailable');
        return res.json();
      })
      .then((data) => {
        const current = data?.current;
        if (!current) throw new Error('Invalid weather payload');
        setWeather({
          status: 'success',
          temperatureC: Math.round(current.temperature_2m),
          windSpeedKmh: Math.round(current.wind_speed_10m),
          precipitationMm: Number(current.precipitation ?? 0),
          conditionLabel: describeWeatherCode(Number(current.weather_code ?? 0)),
          updatedAt: new Date().toLocaleTimeString('en-PH', {
            hour: 'numeric',
            minute: '2-digit',
          }),
        });
      })
      .catch((err) => {
        if (err instanceof Error && err.name === 'AbortError') return;
        setWeather({ status: 'error' });
      });

    return () => controller.abort();
  }, [cityName, isOnline]);

  return weather;
}
