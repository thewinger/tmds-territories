"use client";
import {
  useState,
  useMemo,
  useEffect,
  useRef,
  ChangeEvent,
  MouseEvent,
} from "react";
import { offices, territoryNames } from "../lib/territories-offices";

// Define a type for Office entries.
interface Office {
  territoryCodes: string[];
  id: string;
  updated: number;
  name: string;
  url: string;
  documentCount: number;
}

// Typecast the imported offices to Office[]
const typedOffices = offices as Office[];

const Autocomplete = () => {
  // Multiselect state.
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [query, setQuery] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lowercase search query.
  const lowerQuery = query.trim().toLowerCase();

  // Helper: return mapped territory names for an office.
  const getTerritoryNames = (office: Office): string[] =>
    office.territoryCodes.map((code) => territoryNames[code]).filter(Boolean);

  // Custom filtering for "Europe": if user types "europe", show all European countries from offices,
  // excluding EUIPO ("EM") and WIPO ("WO").
  const europeSuggestions = useMemo(() => {
    if (!lowerQuery.includes("europe")) return null;
    const europeanOffices = typedOffices.filter(
      (office) =>
        (office.territoryCodes.includes("EU") ||
          office.territoryCodes.includes("EUR")) &&
        !["EM", "WO"].includes(office.id),
    );
    const territorySet = new Set<string>();
    europeanOffices.forEach((office) => {
      getTerritoryNames(office).forEach((name) => territorySet.add(name));
    });
    return Array.from(territorySet).sort((a, b) => a.localeCompare(b));
  }, [lowerQuery]);

  // Standard filtering (only if query does not include "europe").
  const officesByTerritory = useMemo(
    () =>
      lowerQuery && !lowerQuery.includes("europe")
        ? typedOffices.filter((office) =>
            office.territoryCodes.some(
              (code) =>
                territoryNames[code] &&
                territoryNames[code].toLowerCase().includes(lowerQuery),
            ),
          )
        : [],
    [lowerQuery],
  );

  const officesByName = useMemo(
    () =>
      lowerQuery && !lowerQuery.includes("europe")
        ? typedOffices.filter((office) =>
            office.name.toLowerCase().includes(lowerQuery),
          )
        : [],
    [lowerQuery],
  );

  // If exactly one office matches by name, offer its territory names as suggestions.
  const singleOffice = officesByName.length === 1 ? officesByName[0] : null;
  const territorySuggestions =
    !lowerQuery.includes("europe") && singleOffice && lowerQuery
      ? getTerritoryNames(singleOffice).filter((name) =>
          name.toLowerCase().includes(lowerQuery),
        )
      : [];

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setActiveIndex(-1);
    setDropdownOpen(true);
  };

  // When an item is selected, add it if not already selected.
  // Do NOT clear the query so the dropdown remains open.
  const handleSelect = (value: string, e: MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    if (!selectedItems.includes(value)) {
      setSelectedItems((prev) => [...prev, value]);
    } else {
      setSelectedItems((prev) => prev.filter((item) => item !== value));
    }
  };

  // Remove a tag.
  const removeItem = (item: string) => {
    setSelectedItems((prev) => prev.filter((i) => i !== item));
  };

  // Close dropdown when clicking outside.
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="w-xl mx-auto mt-10 relative">
      <label className="block font-medium mb-1">Territories/Offices</label>
      <div className="flex items-center gap-2 flex-wrap border border-gray-300 rounded p-2 focus-within:ring focus-within:border-blue-300">
        {selectedItems.map((item) => (
          <span
            key={item}
            className="flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
          >
            {item}
            <button
              className="ml-1 text-blue-600 hover:text-blue-800"
              onClick={() => removeItem(item)}
            >
              &times;
            </button>
          </span>
        ))}
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleChange}
          onFocus={() => setDropdownOpen(true)}
          className="flex-1 min-w-[100px] outline-none p-1"
        />
      </div>

      {dropdownOpen &&
        ((europeSuggestions && europeSuggestions.length > 0) ||
          officesByTerritory.length > 0 ||
          officesByName.length > 0 ||
          territorySuggestions.length > 0) && (
          <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded shadow mt-1 max-h-60 overflow-y-auto">
            {lowerQuery.includes("europe") && europeSuggestions ? (
              <>
                <li className="px-3 py-2 bg-gray-50 font-semibold text-sm">
                  European Countries
                </li>
                {europeSuggestions.map((country, index) => (
                  <li
                    key={country}
                    className={`px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-blue-100 ${
                      activeIndex === index ? "bg-blue-100" : ""
                    }`}
                    onMouseDown={(e) => handleSelect(country, e)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(country)}
                      onChange={() => {}} // React requires onChange handler
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      onClick={(e) => e.stopPropagation()} // Prevent double triggering
                    />
                    <span>{country}</span>
                  </li>
                ))}
              </>
            ) : singleOffice && territorySuggestions.length > 0 ? (
              <>
                <li className="px-3 py-2 bg-gray-50 font-semibold text-sm">
                  Territories for {singleOffice.name}
                </li>
                {territorySuggestions.map((territory, index) => (
                  <li
                    key={territory}
                    className={`px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-blue-100 ${
                      activeIndex === index ? "bg-blue-100" : ""
                    }`}
                    onMouseDown={(e) => handleSelect(territory, e)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(territory)}
                      onChange={() => {}} // React requires onChange handler
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      onClick={(e) => e.stopPropagation()} // Prevent double triggering
                    />
                    <span>{territory}</span>
                  </li>
                ))}
              </>
            ) : (
              <>
                {officesByTerritory.length > 0 && (
                  <>
                    <li className="px-3 py-2 bg-gray-50 font-semibold text-sm">
                      Offices covering matching territory
                    </li>
                    {officesByTerritory.map((office, index) => (
                      <li
                        key={office.id}
                        className={`px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-blue-100 ${
                          activeIndex === index ? "bg-blue-100" : ""
                        }`}
                        onMouseDown={(e) => handleSelect(office.name, e)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(office.name)}
                          onChange={() => {}} // React requires onChange handler
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          onClick={(e) => e.stopPropagation()} // Prevent double triggering
                        />
                        <span>{office.name}</span>
                      </li>
                    ))}
                  </>
                )}
                {officesByName.length > 0 && (
                  <>
                    <li className="px-3 py-2 bg-gray-50 font-semibold text-sm">
                      Offices matching name
                    </li>
                    {officesByName.map((office, index) => (
                      <li
                        key={office.id}
                        className={`px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-blue-100 ${
                          activeIndex === index ? "bg-blue-100" : ""
                        }`}
                        onMouseDown={(e) => handleSelect(office.name, e)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(office.name)}
                          onChange={() => {}} // React requires onChange handler
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          onClick={(e) => e.stopPropagation()} // Prevent double triggering
                        />
                        <span>{office.name}</span>
                      </li>
                    ))}
                  </>
                )}
              </>
            )}
          </ul>
        )}
    </div>
  );
};

export default Autocomplete;

