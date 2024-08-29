import { useState, useEffect } from "react";

const useSearch = (data, initialQuery = "") => {
  const [query, setQuery] = useState(initialQuery);
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    const filtered = data.filter((employee) =>
      `${employee.first_name} ${employee.last_name}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  }, [data, query]);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
  };

  return { filteredData, handleSearch };
};

export default useSearch;
