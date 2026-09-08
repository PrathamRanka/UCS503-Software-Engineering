import { useEffect, useState } from "react";
import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  LoaderCircle,
  MapPin,
  Snowflake,
  Sun,
  type LucideIcon,
} from "lucide-react";

type CurrentWeather = {
  temperature_2m: number;
  apparent_temperature: number;
  weather_code: number;
  is_day: number;
};

type WeatherResponse = {
  current?: CurrentWeather;
};

type WeatherVisual = {
  label: string;
  icon: LucideIcon;
};

const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=30.3398&longitude=76.3869&current=temperature_2m,apparent_temperature,weather_code,is_day&timezone=Asia%2FKolkata";

function getWeatherVisual(code: number): WeatherVisual {
  if (code === 0) return { label: "Clear sky", icon: Sun };
  if ([1, 2].includes(code)) return { label: "Mainly clear", icon: CloudSun };
  if (code === 3) return { label: "Overcast", icon: Cloud };
  if ([45, 48].includes(code)) return { label: "Foggy", icon: CloudFog };
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code))
    return { label: "Rain", icon: CloudRain };
  if ([71, 73, 75, 77, 85, 86].includes(code))
    return { label: "Snow", icon: Snowflake };
  if ([95, 96, 99].includes(code))
    return { label: "Thunderstorm", icon: CloudLightning };
  return { label: "Current weather", icon: CloudSun };
}

export function LiveWeather() {
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const loadWeather = async () => {
      try {
        const response = await fetch(WEATHER_URL, { signal: controller.signal });
        if (!response.ok) throw new Error("Weather request failed");
        const data = (await response.json()) as WeatherResponse;
        if (!data.current) throw new Error("Current weather unavailable");
        setWeather(data.current);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setFailed(true);
      }
    };
    void loadWeather();
    return () => controller.abort();
  }, []);

  if (failed)
    return (
      <div className="flex items-center gap-2 text-neutral-500" role="status">
        <MapPin size={17} />
        <span className="text-[10px] leading-4">
          <b className="block text-[#171719] dark:text-white">Patiala</b>
          Weather unavailable
        </span>
      </div>
    );

  if (!weather)
    return (
      <div className="flex items-center gap-2 text-neutral-500" role="status" aria-label="Loading Patiala weather">
        <LoaderCircle className="animate-spin motion-reduce:animate-none" size={17} />
        <span className="text-[10px]">Patiala weather</span>
      </div>
    );

  const visual = getWeatherVisual(weather.weather_code);
  const WeatherIcon = visual.icon;
  return (
    <div
      className="flex items-center gap-3 text-[#ed111c]"
      role="status"
      aria-label={`${visual.label} in Patiala, ${Math.round(weather.temperature_2m)} degrees Celsius`}
      title={`Feels like ${Math.round(weather.apparent_temperature)}°C in Patiala, Punjab`}
    >
      <WeatherIcon size={19} strokeWidth={1.8} />
      <span className="text-[10px] leading-4 text-neutral-500">
        <b className="block text-sm text-[#171719] dark:text-white">
          {Math.round(weather.temperature_2m)}°
        </b>
        {visual.label} · Patiala
      </span>
    </div>
  );
}
