"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type SearchProps = {
  search: string;
  setSearch: (value: string) => void;
};

export default function Search({
  search,
  setSearch,
}: SearchProps) {

  return (

    <div className="relative mb-4">

      <input
        type="text"
        placeholder="Search shipment..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-md py-2 pl-10 text-sm"
      />

      <MagnifyingGlassIcon
        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
      />

    </div>
  );
}