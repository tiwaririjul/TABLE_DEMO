import React, { useCallback, useMemo, useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ModuleRegistry,
  NumberEditorModule,
  NumberFilterModule,
  PaginationModule,
  RowSelectionModule,
  TextEditorModule,
  TextFilterModule,
  ValidationModule,
  TooltipModule,
} from "ag-grid-community";
import Papa from "papaparse"; // Add papaparse for CSV parsing
import { data } from "./data";
import { companyLogoRender } from "./cellRenders";

// Register AG Grid modules
ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  TextFilterModule,
  NumberFilterModule,
  RowSelectionModule,
  PaginationModule,
  ClientSideRowModelModule,
  ValidationModule /* Development Only */,
  TooltipModule,
]);

const GridExample = () => {
  const [rowData, setRowData] = useState(data);
  const [quickFilterText, setQuickFilterText] = useState("");
  const [gridApi, setGridApi] = useState(null); // Store the grid API

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Personal Details",
        children: [
          {
            field: "full_name",
            headerName: "Full Name",
            valueGetter: (p) => p.data.first_name + " " + p.data.last_name,
            sortable: true,
            pinned: "left", // 🔥 This keeps it frozen on the left
            lockPinned: true, // Optional: Prevents user from unpinning
            tooltipField: "full_name",
          },
          {
            field: "email",
            headerName: "Email",
            pinned: "left",
            lockPinned: true,
          },
          {
            field: "mobile_no",
            headerName: "Mobile No",
            pinned: "left",
            lockPinned: true,
          },
          {
            field: "job_title",
            headerName: "Job Title",
            pinned: "left",
            lockPinned: true,
            tooltipValueGetter: (params) =>
              params.value ? `Job: ${params.value}` : "No job title available", // ✅ Dynamic tooltip
          },
        ],
      },
      {
        headerName: "Company Info",
        children: [
          {
            field: "company_name",
            headerName: "Company Name",
            cellRenderer: companyLogoRender,
          },
          { field: "address", headerName: "Address" },
          { field: "city", headerName: "City" },
          { field: "state", headerName: "State" },
          { field: "zip_code", headerName: "Zip Code" },
          { field: "country", headerName: "Country" },
        ],
      },
      {
        headerName: "Lifecycle Info",
        children: [
          { field: "lifecycle_stage", headerName: "Lifecycle Stage" },
          { field: "status", headerName: "Status" },
          { field: "tags", headerName: "Tags" },
        ],
      },
      {
        headerName: "Social Links",
        children: [
          { field: "facebook_username", headerName: "Facebook Username" },
          { field: "twitter_username", headerName: "Twitter Username" },
          { field: "linkedin_username", headerName: "LinkedIn Username" },
        ],
      },
      {
        headerName: "Reply Stats",
        children: [
          { field: "replyCount", headerName: "Reply Count" },
          { field: "RFQ", headerName: "RFQ" },
          { field: "Positive", headerName: "Positive" },
          { field: "Negative", headerName: "Negative" },
          { field: "Neutral", headerName: "Neutral" },
        ],
      },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      editable: true,
      filter: true,
      flex: 1,
      minWidth: 100,
    }),
    []
  );

  const rowSelection = useMemo(
    () => ({
      mode: "multiRow",
      groupSelects: "descendants",
    }),
    []
  );

  const onGridReady = useCallback((params) => {
    // setGridApi(params.api); // Save the API to the state
    // fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
    //   .then((resp) => resp.json())
    //   .then((data) => setRowData(data));
  }, []);

  const onQuickFilterChange = (event) => {
    const value = event.target.value;
    setQuickFilterText(value);
    // if (gridApi) {
    //   gridApi.setQuickFilter(value); // Use the grid API to set the quick filter
    // }
  };

  // Export Grid Data to CSV
  const exportToCSV = () => {
    if (gridApi) {
      gridApi.exportDataAsCsv();
    }
  };

  // Handle CSV file upload and parse it
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const newData = result.data; // The entire data array (without the header row)

          console.log("newData ", newData);

          // Append newData to the existing rowData
          setRowData((prevData) => [...prevData, ...newData]); // Merge the previous data with the new data
        },
        header: true, // Optional: Set to `true` if CSV contains headers
        skipEmptyLines: true, // Optional: Ignore empty lines in the CSV
      });
    }
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div style={{ height: "100%", width: "100%" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection={rowSelection}
          pagination={true}
          groupIncludeFooter={true} // Show a footer for grouped rows
          groupUseEntireRow={true} // Use the entire row for the group header
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <GridExample />
  </StrictMode>
);
window.tearDownExample = () => root.unmount();
// import React, { useCallback, useMemo, useState, StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { AgGridReact } from "ag-grid-react";
// import {
//   ClientSideRowModelModule,
//   ModuleRegistry,
//   NumberEditorModule,
//   NumberFilterModule,
//   PaginationModule,
//   RowSelectionModule,
//   TextEditorModule,
//   TextFilterModule,
//   ValidationModule,
// } from "ag-grid-community";
// import Papa from "papaparse"; // Add papaparse for CSV parsing

// // Register AG Grid modules
// ModuleRegistry.registerModules([
//   NumberEditorModule,
//   TextEditorModule,
//   TextFilterModule,
//   NumberFilterModule,
//   RowSelectionModule,
//   PaginationModule,
//   ClientSideRowModelModule,
//   ValidationModule /* Development Only */,
// ]);

// const GridExample = () => {
//   const [rowData, setRowData] = useState([]);
//   const [quickFilterText, setQuickFilterText] = useState("");
//   const [gridApi, setGridApi] = useState(null); // Store the grid API

//   const columnDefs = useMemo(
//     () => [
//       {
//         headerName: "Athlete Info",
//         children: [
//           { field: "athlete", minWidth: 170 },
//           { field: "age" },
//           {
//             field: "country",
//             rowGroup: true, // Group by country
//             hide: true, // Hide the column but still use it for grouping
//           },
//         ],
//       },
//       {
//         headerName: "Medals",
//         children: [
//           { field: "gold" },
//           { field: "silver" },
//           { field: "bronze" },
//           { field: "total" },
//         ],
//       },
//       { field: "year" },
//       { field: "date" },
//       { field: "Sample1" },
//       { field: "Sample2" },
//       { field: "Sample3" },
//       { field: "Sample4" },
//       { field: "Sample5" },
//       { field: "Sample6" },
//       { field: "Sample7" },
//       { field: "Sample8" },
//     ],
//     []
//   );

//   const defaultColDef = useMemo(
//     () => ({
//       editable: true,
//       filter: true,
//       flex: 1,
//       minWidth: 100,
//     }),
//     []
//   );

//   const rowSelection = useMemo(
//     () => ({
//       mode: "multiRow",
//       groupSelects: "descendants",
//     }),
//     []
//   );

//   const onGridReady = useCallback((params) => {
//     setGridApi(params.api); // Save the API to the state
//     fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
//       .then((resp) => resp.json())
//       .then((data) => setRowData(data));
//   }, []);

//   const onQuickFilterChange = (event) => {
//     const value = event.target.value;
//     setQuickFilterText(value);
//     // if (gridApi) {
//     //   gridApi.setQuickFilter(value); // Use the grid API to set the quick filter
//     // }
//   };

//   // Export Grid Data to CSV
//   const exportToCSV = () => {
//     if (gridApi) {
//       gridApi.exportDataAsCsv();
//     }
//   };

//   // Handle CSV file upload and parse it
//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       Papa.parse(file, {
//         complete: (result) => {
//           const newData = result.data; // The entire data array (without the header row)

//           console.log("newData ", newData);

//           // Append newData to the existing rowData
//           setRowData((prevData) => [...prevData, ...newData]); // Merge the previous data with the new data
//         },
//         header: true, // Optional: Set to `true` if CSV contains headers
//         skipEmptyLines: true, // Optional: Ignore empty lines in the CSV
//       });
//     }
//   };

//   return (
//     <div style={{ width: "100%", height: "100%" }}>
//       <input
//         type="text"
//         placeholder="Search..."
//         value={quickFilterText}
//         onChange={onQuickFilterChange}
//         style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
//       />
//       <div>
//         {/* File upload button */}
//         <input
//           type="file"
//           accept=".csv"
//           onChange={handleFileUpload}
//           style={{ marginBottom: "10px" }}
//         />
//         {/* Export to CSV button */}
//         <button onClick={exportToCSV} style={{ marginBottom: "10px" }}>
//           Export to CSV
//         </button>
//       </div>
//       <div style={{ height: "100%", width: "100%" }}>
//         <AgGridReact
//           rowData={rowData}
//           columnDefs={columnDefs}
//           defaultColDef={defaultColDef}
//           rowSelection={rowSelection}
//           pagination={true}
//           groupIncludeFooter={true} // Show a footer for grouped rows
//           groupUseEntireRow={true} // Use the entire row for the group header
//           onGridReady={onGridReady}
//         />
//       </div>
//     </div>
//   );
// };

// const root = createRoot(document.getElementById("root"));
// root.render(
//   <StrictMode>
//     <GridExample />
//   </StrictMode>
// );
// window.tearDownExample = () => root.unmount();
