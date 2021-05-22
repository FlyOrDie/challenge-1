import React, { useState, useCallback } from "react";

import useDelayedRequest from "./useDelayedRequest";
import useClickOutside from "./useClickOutside";

import { splitByQuery } from "./helpers";
import {
  NOT_FOUND_MESSAGE,
  REQUEST_DELAY,
  DEFAULT_PLACEHOLDER,
} from "./config";

import "./Autocomplete.css";

const AutocompleteFunc = ({
  requestData,
  renderItem,
  onChoose,
  requestDelay = REQUEST_DELAY,
  placeholder = DEFAULT_PLACEHOLDER,
}) => {
  const [query, setQuery] = useState("");
  const [isLoading, suggestions] = useDelayedRequest(
    requestData,
    query,
    requestDelay
  );
  const [isOpened, setIsOpened] = useState(false);
  const handleClickOutside = useCallback(() => isOpened && setIsOpened(false), [
    isOpened,
  ]);

  useClickOutside(handleClickOutside);

  const handleInputChange = (e) => setQuery(e.target.value);
  const handleInputClick = (e) => {
    e.stopPropagation();

    !isOpened && setIsOpened(true);
  };
  const handleMessageClick = (e) => e.stopPropagation();
  const handleItemClick = (suggestion) => (e) => {
    e.stopPropagation();

    setQuery(suggestion.text);
    setIsOpened(false);
    onChoose && onChoose(suggestion);
  };
  const shouldDisplayNotFound =
    !isLoading && !suggestions.length && query.length > 0;
  const shouldDisplaySuggestions = !isLoading && !shouldDisplayNotFound;

  return (
    <div className="autocomplete">
      <form autoComplete="off" role="search" className="autocomplete__form">
        <label htmlFor="search-input-2">
          <span className="autocomplete__label-text">Select country</span>
        </label>
        <input
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpened ? "true" : "false"}
          aria-owns="search-results-2"
          id="search-input-2"
          value={query}
          onChange={handleInputChange}
          onClick={handleInputClick}
          type="search"
          className="autocomplete__input"
          placeholder={placeholder}
        />
      </form>

      {isOpened && Boolean(query.length) && (
        <ul
          className="autocomplete__list"
          role="listbox"
          aria-label="countries"
          id="search-results-2"
        >
          {isLoading && (
            <li
              className="autocomplete__list-item autocomplete__list-item_loading"
              onClickCapture={handleMessageClick}
            >
              Loading...
            </li>
          )}
          {shouldDisplayNotFound && (
            <li
              role="option"
              className="autocomplete__list-item autocomplete__list-item_not-found"
              onClickCapture={handleMessageClick}
            >
              {renderItem([NOT_FOUND_MESSAGE])}
            </li>
          )}
          {shouldDisplaySuggestions && (
            <>
              {suggestions.map((suggestion, index) => (
                <li
                  className="autocomplete__list-item"
                  key={suggestion.id || index}
                  onClickCapture={handleItemClick(suggestion)}
                >
                  {renderItem(splitByQuery(query, suggestion.text))}
                </li>
              ))}
            </>
          )}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteFunc;
