/*
Properties of the table:
    1. Should be able to add and delete items easily
    2. Calculate total
    props
*/
import React, { useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useGlobalState } from "./globalState";
import './component.css';


function CatalogComponent( props ) {
// Initial row data with unique IDs
const {catalogData, updateCatalogData, columnDefs} = useGlobalState();
const [rowData, setRowData] = useState(structuredClone(catalogData));

  // Column definitions
  // Framework components for custom cell renderers
  const deleteSelectedRows = useCallback(() => {
    const gridApi = gridRef.current.api; // Get the grid API reference
    const selectedRows = gridApi.getSelectedRows(); // Get selected rows

    // Filter out selected rows from the rowData
    setRowData((prevRowData) =>
      prevRowData.filter((row) => !selectedRows.includes(row))
    );
  }, []);

  const gridRef = React.useRef(null);

  const addEmptyRow = useCallback(() => {
    const newRow = { id: Date.now() };
    setRowData((prevRowData) => [...prevRowData, newRow]);
  }, []);

  const resetChanges = () => {
    setRowData( structuredClone(catalogData) );
  }
  const pushCatalogData = () => {
    const postDailyRecord = async () => {
      try{
        const response = await fetch(`${process.env.REACT_APP_PRODUCT_CATALOG}`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(rowData),
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        updateCatalogData( structuredClone(rowData) );
      }catch (error){
        console.log(error);
      }
    }
    //send data for sync to server
    postDailyRecord();
  }
  const pullCatalogData = async () => {
    const fetchProductCatalog = async () => {
      try{
        const response = await fetch(`${process.env.REACT_APP_PRODUCT_CATALOG}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log("BREAK");
        const result = await response.json();
        let catalog = [];
        const column = result.columns;
        const rows = result.rows;
        //parse this result columns, rows
        rows.forEach(element => {
          let ob = {};
          for( let it = 1; it < column.length; it++ ){
            let k = column[it];
            let val = element[it];
            ob[k] = val;
          }
          catalog.push(ob);
        });
        
        setRowData(structuredClone(catalog));
        updateCatalogData(structuredClone(catalog));
      }catch (error){
        console.log(error);
      }
    }
    fetchProductCatalog();
  }
  const onCellValueChanged = (event) => {
    const updatedRowData = rowData.map((row) =>
      row.id === event.data.id ? { ...row, ...event.data } : row
    );
    setRowData([...updatedRowData]);
  };

  return (
    <div style={{ width: "100%", overflowX: "auto" }} className="ag-grid-table-comp">
      <h3 style={{ textAlign: "center", marginBottom: "10px" }}>{props.title}</h3>

      {/* Add Row Button outside the grid */}
      <div className="button-group">
      <button onClick={addEmptyRow} style={{ marginBottom: "10px" }}>
        Add Product
      </button>

      <button
        onClick={deleteSelectedRows}
        style={{ marginBottom: "10px" }}
        disabled={rowData.length === 0} // Disable button if no rows
      >
        Delete Selected Product(s)
      </button>
      <button className="button-red" onClick={resetChanges} style={{ marginBottom: "10px" }}>
        Discard Changes
      </button>
      <button className="button-green" onClick = {pullCatalogData} style={{ marginBottom: "10px" }}>
        PULL
      </button>
      <button className="button-red" onClick = {pushCatalogData} style={{ marginBottom: "10px" }}>
        PUSH
      </button>
      
      </div>
      

      {/* AG Grid Table */}
      <div className="ag-theme-alpine" style={{ height: "auto", padding: "10px" }}>
        <AgGridReact
          ref={gridRef} // Set gridRef to access the grid API
          rowData={rowData}
          columnDefs={columnDefs}
          onCellValueChanged={onCellValueChanged}
          rowSelection="multiple" // Enable multiple row selection
          domLayout="autoHeight" // Adjust grid height based on content
          defaultColDef={{
            resizable: true,
            sortable: true,
          }}
        />

      </div>
    </div>
  );
}

export default CatalogComponent;
