/*
Properties of the table:
    1. Should be able to add and delete items easily
    2. Calculate total
    props
*/
import React, { useState, useCallback, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { useGlobalState } from "./globalState";
import './component.css';

  
  // Catalog Dialog Component (Product Catalog)
  const ProductCatalogDialog = ({ onClose, onInsert, selectedProducts, setSelectedProducts }) => {
    const {catalogData,columnDefsNonEditable} = useGlobalState();

    const handleRowSelection = (selected) => {
      setSelectedProducts(selected);
    };
  
    const insertSelected = () => {
      onInsert(selectedProducts); // Pass selected products back to parent
      onClose(); // Close the catalog dialog
    };
  
    const handleDeselect = () => {
      setSelectedProducts([]); // Clear selected products
    };
  
    return (
      <div className="catalog-dialog">
        <h3>Product Catalog</h3>
        <div className="ag-theme-alpine" style={{ height: 300, padding: "10px" }}>
          <AgGridReact
            rowData={catalogData}
            columnDefs={columnDefsNonEditable}
            rowSelection="multiple"
            onSelectionChanged={(event) => handleRowSelection(event.api.getSelectedRows())}
          />
        </div>
        <div className="button-group">
        <button onClick={insertSelected}>Insert</button>
        <button onClick={onClose}>Close</button>
        <button onClick={handleDeselect}>Clear Selection</button>
        </div>
        
      </div>
    );
  };

function AgGridTableComponent( {period, value, updateValue} ) {
// Initial row data with unique IDs
const [rowData, setRowData] = useState(structuredClone(value));
const {columnDefsNonEditable} = useGlobalState();

  const [catalogDialogOpen, setCatalogDialogOpen] = useState(false); // Control dialog visibility
  const [selectedProducts, setSelectedProducts] = useState([]); // Store selected products from catalog
  useEffect( () => {
    setRowData(structuredClone(value));
  }, [value])
  // Framework components for custom cell renderers
  const deleteSelectedRows = useCallback(() => {
    const gridApi = gridRef.current.api; // Get the grid API reference
    const selectedRows = gridApi.getSelectedRows(); // Get selected rows

    // Filter out selected rows from the rowData
    const updatedRow = rowData.filter((row) => !selectedRows.includes(row));
    setRowData([...updatedRow]);
    updateValue(period, structuredClone(updatedRow));

  }, [period,rowData, updateValue]);

  const gridRef = React.useRef(null);


  const openCatalogDialog = () => {
    setCatalogDialogOpen(true); // Show catalog dialog
    setSelectedProducts([]);
  };

  // Function to insert selected products into the main table
  const insertIntoMainTable = (products) => {
    setRowData([...rowData, ...products]); // Add selected products to main table
    updateValue(period, [...rowData, ...products]);
  };

  // Close the catalog dialog
  const closeCatalogDialog = () => {
    setCatalogDialogOpen(false); // Close catalog dialog
  };


  return (
    <div style={{ width: "100%", overflowX: "auto" }} className="ag-grid-table-comp">
      <h3 style={{ textAlign: "center", marginBottom: "10px" }}>{period.toUpperCase()}</h3>

      {/* Add Row Button outside the grid */}
      <div className="button-group">
      <button onClick={openCatalogDialog} style={{ marginBottom: "10px" }}>
        Add Row
      </button>

      <button
        onClick={deleteSelectedRows}
        style={{ marginBottom: "10px" }}
        disabled={rowData.length === 0} // Disable button if no rows
      >
        Delete Selected Row(s)
      </button>
      </div>
      

      {/* AG Grid Table */}
      <div className="ag-theme-alpine" style={{ height: "auto", padding: "10px" }}>
        <AgGridReact
          ref={gridRef} // Set gridRef to access the grid API
          rowData={rowData}
          columnDefs={columnDefsNonEditable}
          rowSelection="multiple" // Enable multiple row selection
          domLayout="autoHeight" // Adjust grid height based on content
        />

        {/* Catalog Dialog (Product Catalog) */}
      {catalogDialogOpen && (
        <>
            <div className="overlay" onClick={closeCatalogDialog}></div>
            <ProductCatalogDialog
                onClose={closeCatalogDialog}
                onInsert={insertIntoMainTable}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
            />
        </>
        
      )}
      </div>
    </div>
  );
}

export default AgGridTableComponent;
