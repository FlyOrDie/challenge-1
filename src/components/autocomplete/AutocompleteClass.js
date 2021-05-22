import React, { Component } from "react";

import { splitByQuery } from "./helpers";
import {
  NOT_FOUND_MESSAGE,
  REQUEST_DELAY,
  DEFAULT_PLACEHOLDER,
} from "./config";

import "./Autocomplete.css";

/**
 * Props description
 *
 * @param {function} requestData - A required prop. A function to be called for data fetching. Accepts
 *   query{string} and should return an object with at least 2 properties { text: string, id: any }
 *   if id is not provided -> will rely on map function indexes
 *
 * @param {function} renderItem - A required prop. A function to provide visual rendering of list items.
 *   Accepts an array of 'pieces' { text: string, isHighlighted?: boolean }
 *
 * @param {function} onChoose - if provided, will be called when item is clicked
 * @param {number} requestDelay - Delay between requests, when user is typing. Default 400ms
 * @param {string} placeholder - Input placeholder
 *
 */

export default class AutocompleteClass extends Component {
  static defaultProps = {
    requestDelay: REQUEST_DELAY,
    placeholder: DEFAULT_PLACEHOLDER,
  };

  state = {
    suggestions: [],
    isLoading: false,
    isOpened: false,
    query: "",
  };

  requestTimeout = null;

  /* LIFECYCLE METHODS START */
  constructor(props) {
    super(props);

    this._handleClickOutside = this._handleClickOutside.bind(this);
    this._onInputChanged = this._onInputChanged.bind(this);
    this._onInputClicked = this._onInputClicked.bind(this);
    this._onItemClicked = this._onItemClicked.bind(this);
  }

  componentDidMount() {
    document.addEventListener("click", this._handleClickOutside, false);
  }

  async componentDidUpdate(_, prevState) {
    const { requestDelay } = this.props;

    if (prevState.query !== this.state.query) {
      if (this.state.query === "") {
        this.setState({ suggestions: [] });
      } else {
        /**
         * Reduce number of requests, when the user is typing
         * quickly
         */
        if (this.requestTimeout) {
          clearTimeout(this.requestTimeout);
        }

        this.setState({ isLoading: true });

        this.requestTimeout = setTimeout(async () => {
          try {
            await this._findAndSetSuggestions();
          } catch (e) {
            // Perhaps some error handling, like display an error message
          } finally {
            this.setState({ isLoading: false });
            this.requestTimeout = null;
          }
        }, requestDelay);
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener("click", this._handleClickOutside, false);

    // Clear timeout if any
    if (this.requestTimeout) {
      clearTimeout(this.requestTimeout);
    }
  }

  /* LIFECYCLE METHODS END */

  _handleClickOutside() {
    if (!this.state.isOpened) return;

    this.setState({ isOpened: false });
  }

  async _findAndSetSuggestions() {
    const { requestData } = this.props;

    const suggestions = await requestData(this.state.query);

    this.setState({ suggestions });
  }

  _onInputChanged(e) {
    this.setState({ query: e.target.value });
  }

  _onInputClicked(e) {
    e.stopPropagation();

    if (this.state.isOpened) return;

    this.setState({ isOpened: true });
  }

  _renderList() {
    const { renderItem } = this.props;
    const { suggestions, query, isLoading } = this.state;
    let className = "autocomplete__list-item";

    if (isLoading) {
      className += " autocomplete__list-item_loading";

      return (
        <li className={className} onClickCapture={this._onMessageClicked}>
          Loading...
        </li>
      );
    }

    if (!suggestions.length && query.length) {
      className += " autocomplete__list-item_not-found";

      return (
        <li className={className} onClickCapture={this._onMessageClicked}>
          {renderItem([NOT_FOUND_MESSAGE])}
        </li>
      );
    }

    return (
      <>
        {suggestions.map((suggestion, index) => (
          <li
            className={className}
            key={suggestion.id || index}
            onClickCapture={this._onItemClicked(suggestion)}
          >
            {renderItem(splitByQuery(this.state.query, suggestion.text))}
          </li>
        ))}
      </>
    );
  }

  _onItemClicked(suggestion) {
    return (e) => {
      e.stopPropagation();

      const { onChoose } = this.props;

      this.setState({ query: suggestion.text, isOpened: false });

      onChoose && onChoose(suggestion);
    };
  }

  _onMessageClicked(e) {
    e.stopPropagation();
  }

  render() {
    const { placeholder } = this.props;
    const { isOpened, query } = this.state;

    return (
      <div className="autocomplete">
        <form autoComplete="off" role="search" className="autocomplete__form">
          <label htmlFor="search-input-1">
            <span className="autocomplete__label-text">Select country</span>
          </label>
          <input
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isOpened ? "true" : "false"}
            aria-owns="search-results-1"
            id="search-input-1"
            value={query}
            onChange={this._onInputChanged}
            onClick={this._onInputClicked}
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
            id="search-results-1"
          >
            {this._renderList()}
          </ul>
        )}
      </div>
    );
  }
}
