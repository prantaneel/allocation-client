import React, { createContext, useContext, useState } from "react";

// Create Context
const GlobalStateContext = createContext();

// Create a custom provider to manage global state
export const GlobalStateProvider = ({ children }) => {
  const [catalogData, setCatalogData] = useState([]);

  const [columnDefs] = useState([
    { headerCheckboxSelection: true, checkboxSelection: true, maxWidth: 50 },
    { field: "name", maxWidth: 500, cellClass: "wrap-text", editable: true },
    { field: "cal", maxWidth: 100, editable: true },
    { field: "carb", maxWidth: 100, editable: true },
    { field: "protein", maxWidth: 100, editable: true },
    { field: "fat", maxWidth: 100, editable: true },
    { field: "fill", maxWidth: 100, editable: true },
    { field: "taste", maxWidth: 100, editable: true },
  ]);

  const [columnDefsNonEditable] = useState([
    { headerCheckboxSelection: true, checkboxSelection: true, maxWidth: 50 },
    { field: "name", maxWidth: 500, cellClass: "wrap-text"},
    { field: "cal", maxWidth: 100},
    { field: "carb", maxWidth: 100, editable: false },
    { field: "protein", maxWidth: 100, editable: false },
    { field: "fat", maxWidth: 100, editable: false },
    { field: "fill", maxWidth: 100, editable: false },
    { field: "taste", maxWidth: 100, editable: false },
  ]);

  const [dailyRecord, setDailyRecord] = useState({});
  const [periods] = useState(["breakfast", "lunch", "snacks", "others", "dinner", "junk"]);

  const updateDailyRecord = (newRecord) => {
    setDailyRecord(newRecord);
  }
  // You can have any global state logic here
  const updateCatalogData = (newState) => {
    setCatalogData(newState);
  };

  return (
    <GlobalStateContext.Provider
      value={{ catalogData, updateCatalogData, columnDefs, columnDefsNonEditable, dailyRecord, updateDailyRecord, periods }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

// Custom hook to use the global state
export const useGlobalState = () => {
  return useContext(GlobalStateContext);
};
