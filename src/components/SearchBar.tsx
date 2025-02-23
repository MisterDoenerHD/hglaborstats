
import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mb-8">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search player..."
          className="w-full px-4 py-2 text-pokemon-dark bg-pokemon-light border-2 border-pokemon-border rounded font-mono focus:outline-none focus:ring-2 focus:ring-pokemon-green"
        />
        <button
          type="submit"
          className="absolute right-2 p-2 text-pokemon-dark hover:text-pokemon-green transition-colors"
        >
          <Search size={20} />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
