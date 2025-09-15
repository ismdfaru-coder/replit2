"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FlightSearchFormProps {
  defaultQuery?: string;
  asButton?: boolean;
  onSearch?: (query: string) => void;
}

export function FlightSearchForm({ defaultQuery = "", asButton = false, onSearch }: FlightSearchFormProps) {
  const [query, setQuery] = useState(defaultQuery);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query);
    }
  };

  const handleButtonClick = () => {
    if (query.trim() && onSearch) {
      onSearch(query);
    }
  };

  if (asButton) {
    return (
      <button onClick={handleButtonClick} className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all duration-300 whitespace-nowrap cursor-pointer">
        {query}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-center flex-shrink-0">
      <div className="max-w-[804px] w-full rounded-[17px] mb-6 overflow-hidden p-0.5 shadow-lg bg-gradient-to-r from-gray-100 to-gray-200">
        <div className="w-full bg-white rounded-2xl">
          <div className="px-4 pt-3.5 pb-1.5">
            <textarea
              name="input-bar"
              placeholder="Type your needs"
              className="w-full p-0 min-h-[24px] rounded-none placeholder:text-gray-400 placeholder:text-sm text-sm resize-none border-none outline-none bg-white text-black"
              rows={1}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  handleSubmit(e);
                }
              }}
            ></textarea>
          </div>
          <div className="flex items-center justify-between h-11 pl-2 pr-1.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-[#FF6B35]/10 cursor-pointer transition hover:bg-[#FF6B35]/20">
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-mic-line text-[#FF6B35]"></i>
                </div>
              </div>
            </div>
            <button type="submit" disabled={!query.trim()} className="p-1.5 rounded-full transition-all cursor-pointer bg-gray-300 disabled:cursor-not-allowed enabled:bg-primary">
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-send-plane-line text-white"></i>
              </div>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
