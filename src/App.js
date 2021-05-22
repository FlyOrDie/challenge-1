import React, { useCallback } from "react";

import { AutocompleteClass, AutocompleteFunc } from "./components/autocomplete";

import "./App.css";

const REQUEST_URL = "http://localhost:3123/countries?query=";

const requestData = async (query) => {
  const response = await fetch(`${REQUEST_URL}${query}`);

  if (response.ok) {
    return response.json();
  }

  return [];
};

const App = () => {
  const renderItem = useCallback((pieces) => {
    // Can have map index keys
    const renderedPieces = pieces.map(({ text, isHighlighted }, index) => {
      if (!isHighlighted) return text;

      const className =
        "autocomplete__text-section autocomplete__text-section_highlighted";

      return (
        <mark key={index} className={className}>
          {text}
        </mark>
      );
    });

    return renderedPieces;
  }, []);

  return (
    <div className="App">
      <h1>Deel code challenge</h1>

      <section>
        <h2>Autocomplete class component example</h2>
        <AutocompleteClass
          onChoose={console.log}
          requestData={requestData}
          renderItem={renderItem}
        />
      </section>

      <section>
        <h2>Autocomplete functional component example</h2>
        <AutocompleteFunc
          onChoose={console.log}
          requestData={requestData}
          renderItem={renderItem}
        />
      </section>
    </div>
  );
};

export default App;
