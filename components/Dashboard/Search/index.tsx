import React from "react";
import "./styles.css";
import SearchIcon from "@mui/icons-material/Search";

interface Props {
    search: string;
    handleChange: (e: React.ChangeEvent) => void;
}

function Search({ search, handleChange }: Props) {
  return (
    <div className="search-flex">
      <SearchIcon sx={{ color: "var(--grey)", fontSize: "1.2rem" }} />
      <input
        className="search-input"
        placeholder="Search"
        value={search}
        onChange={(e) => handleChange(e)}
      />
    </div>
  );
}

export default Search;