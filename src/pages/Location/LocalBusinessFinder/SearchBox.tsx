import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useSearchPlacesQuery } from "@/features/location/locationAPI";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchBoxProps {
  onSelectLocation: (lat: number, lon: number) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSelectLocation }) => {
  const [query, setQuery] = useState("");
  const searchQuery = useDebounce(query,1000)
  const { data, isFetching } = useSearchPlacesQuery(searchQuery, { skip: !searchQuery });

  return (
    <div className=" w-full max-w-md z-30 backdrop-blur-sm dark:bg-gray-600/40">
      <Input
        type="text"
        placeholder="Search a place..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        
        className="px-4 py-2 rounded-md shadow-md"
      />
      {query && data && data?.length > 0 && (
        <ul className="absolute z-10 bg-white backdrop-blur-sm dark:bg-gray-800/80 border rounded-md shadow-lg w-full mt-2">
          {data.map((place: any) => (
            <li
              key={place.place_id}
              className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                onSelectLocation(parseFloat(place.lat), parseFloat(place.lon));
                setQuery(""); // Clear input after selection
              }}
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
      {isFetching && <p className="text-sm text-gray-500 mt-2">Loading...</p>}
    </div>
  );
};

export default SearchBox;
