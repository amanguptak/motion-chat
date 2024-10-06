"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchSchedules } from "@/lib/animeApi";

interface Schedule {
  mal_id: number;
  title: string;
  synopsis: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
}

const SchedulesPage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("monday");
  const [kids, setKids] = useState<string>("false");
  const [sfw, setSfw] = useState<string>("true");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchSchedules(filter, kids, sfw);
        setSchedules(data);
      } catch (err) {
        setError("Failed to load schedules.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter, kids, sfw]);

  return (
    <div className="min-h-screen p-6  text-white">
      <h1 className="text-4xl font-bold mb-8 text-center text-yellow-400">Anime Schedules</h1>

      {/* Filters */}
      <div className="flex justify-center gap-8 mb-8">
        <FilterSelect
          label="Filter by Day"
          value={filter}
          options={["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "other"]}
          onChange={(e) => setFilter(e.target.value)}
        />
        <FilterSelect
          label="Kids Genre"
          value={kids}
          options={["false", "true"]}
          onChange={(e) => setKids(e.target.value)}
        />
        <FilterSelect
          label="Safe For Work"
          value={sfw}
          options={["true", "false"]}
          onChange={(e) => setSfw(e.target.value)}
        />
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center">
          <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-yellow-400 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="bg-red-500 p-4 rounded-lg text-center">{error}</p>}

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {!loading &&
          schedules.map((schedule) => (
            <div
              key={schedule.mal_id}
              className="break-inside-avoid p-4 bg-[#4b62c1] rounded-lg hover:shadow-lg transition-all"
            >
              <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
                <Image
                  src={schedule.images.jpg.image_url}
                  alt={schedule.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 ease-in-out hover:scale-105"
                />
              </div>
              <h2 className="text-xl font-bold text-yellow-400 mt-4">
                {schedule.title}
              </h2>
              <p className="text-gray-300 mt-2">
                {schedule.synopsis || "No synopsis available."}
              </p>
            
            </div>
          ))}
      </div>

      {/* No Results */}
      {!loading && schedules.length === 0 && (
        <p className="text-center text-yellow-400 mt-8">No schedules available.</p>
      )}
    </div>
  );
};

// FilterSelect Component to handle filter options
interface FilterSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const FilterSelect: React.FC<FilterSelectProps> = ({ label, value, options, onChange }) => (
  <div className="flex flex-col items-center">
    <label className="block text-md font-semibold text-yellow-400 mb-2">
      {label}:
    </label>
    <select
      value={value}
      onChange={onChange}
      className="bg-[#4b62c1] text-white font-medium rounded-md py-2 px-4 transition duration-300 hover:shadow-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </option>
      ))}
    </select>
  </div>
);

export default SchedulesPage;
