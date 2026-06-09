"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronUpDownIcon, MagnifyingGlassIcon, CheckIcon } from "@heroicons/react/24/outline";

export interface Option {
  label: string;
  value: string;
}

export interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  error?: boolean;
  name?: string;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  error,
  name,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase())
  );

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className="relative w-full text-slate-900" ref={ref}>
      {name && <input type="hidden" name={name} value={value} />}
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          if (!open) setQuery("");
        }}
        className={`flex w-full items-center justify-between rounded-xl border bg-white px-4 py-3 text-left outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
          error ? "border-red-500" : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <span className={selectedOption ? "text-slate-900 font-medium truncate pr-4" : "text-slate-400 truncate pr-4"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronUpDownIcon className="h-5 w-5 shrink-0 text-slate-400" />
      </button>

      {/* Dropdown Content */}
      {open && (
        <div className="absolute z-[9999] mt-2 w-full rounded-xl border border-slate-200 bg-white p-1 shadow-2xl animate-in fade-in zoom-in-95 origin-top">
          {/* Search Input */}
          <div className="flex items-center border-b border-slate-100 px-3 pb-1">
            <MagnifyingGlassIcon className="mr-2 h-4 w-4 shrink-0 text-slate-400" />
            <input
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
          
          {/* Options List */}
          <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-slate-500">No results found.</div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`relative flex w-full cursor-pointer select-none items-center rounded-md py-2.5 pl-3 pr-9 text-sm outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 ${
                    value === option.value ? "bg-blue-50 font-bold text-blue-900" : "text-slate-700"
                  }`}
                >
                  <span className="block truncate">{option.label}</span>
                  {value === option.value && (
                    <span className="absolute right-3 flex h-4 w-4 items-center justify-center text-blue-600">
                      <CheckIcon className="h-4 w-4" />
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
