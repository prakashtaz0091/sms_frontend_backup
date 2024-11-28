import React, { useState, useEffect, useContext } from "react";
import { MdAccountBalanceWallet } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { FiRefreshCcw } from "react-icons/fi";
import { IoFilterSharp } from "react-icons/io5";
import Table from "./ChartTable";
import { AuthContext } from "../../../context/AuthContext";

const ChartAccount = () => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // For search functionality
  const [newHead, setNewHead] = useState("");
  const [newType, setNewType] = useState("");

  const { api } = useContext(AuthContext);

  useEffect(() => {
    const getChartOfAccounts = async () => {
      try {
        const response = await api.get("/get_chart_of_accounts/");
        setRows(response.data);
        setFilteredRows(response.data);
        setAllRows(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getChartOfAccounts();
  }, [api]);

  // Function to handle search
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = rows.filter(
      (row) =>
        row.head.toLowerCase().includes(value) ||
        row.type.toLowerCase().includes(value)
    );
    setFilteredRows(filtered);
  };

  // Function to handle refresh
  const handleRefresh = () => {
    setFilteredRows(rows);
    setSearchTerm(""); // Clear search term
  };

  // Function to handle delete
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (confirmDelete) {
      const newRows = rows.filter((row) => row.id !== id);
      setRows(newRows);
      setFilteredRows(newRows);
    }

    const deleteChartOfAccount = async () => {
      try {
        const response = await api.delete(`/delete_chart_of_accounts/${id}/`);
        alert(response.data.message);
      } catch (error) {
        alert("Failed to delete chart of account.");
      }
    };
    deleteChartOfAccount();


  };

  // Function to add a new chart of account
  const handleSaveHead = () => {
    if (newHead && newType) {
      const newRow = {
        // id: rows.length + 1, // Generate a temporary ID
        // school_id: 1, // Example school_id
        head: newHead,
        type: newType,
      };
      const newRows = [newRow, ...rows ];
      setRows(newRows);
      setFilteredRows(newRows);
      setNewHead(""); // Reset the form
      setNewType("");


      const addChartOfAccount = async () => {
        try {
          const response = await api.post("/add_chart_of_accounts/", newRow);
          alert(response.data.message);
        } catch (error) {
          alert("Failed to add chart of account.");
        }
      };
      addChartOfAccount();



    }
  };

  return (
    <div className="p-8 bg-pink-100">
      <div className="flex gap-4 bg-white rounded-3xl p-2">
        <div className="flex items-center space-x-2">
          <MdAccountBalanceWallet className="text-gray-700" />
          <span className="text-gray-700 font-medium">Account</span>
        </div>

        <div className="border-l border-gray-700 h-6"></div>

        <div>
          <span className="text-gray-700 font-medium">Chart of Account</span>
        </div>
      </div>

      <div className="flex flex-row justify-between gap-4">
        <div className="w-2/3 mt-10 flex flex-col bg-white shadow-md rounded-2xl items-center h-2/3">
          <h3 className="mb-8 text-2xl font-semibold flex mt-10">Add Chart of Account</h3>
          <input
            type="text"
            className="p-2 px-4 mb-4 rounded-3xl placeholder-black border border-blue-500 w-2/3"
            placeholder="Head"
            value={newHead}
            onChange={(e) => setNewHead(e.target.value)} // Bind input to state
          />
          <select
            className="p-3 px-4 rounded-3xl bg-white mt-4 border border-blue-500 w-2/3"
            value={newType}
            onChange={(e) => setNewType(e.target.value)} // Bind select to state
          >
            <option value="" disabled>
              Type
            </option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <button
            className="mt-16 bg-pink-500 rounded-3xl text-white p-2 px-4 font-bold mb-16"
            onClick={handleSaveHead}
          >
            Save Head
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col w-full">
          <div className="flex flex-row gap-4 py-10 justify-end">
            <div className="flex items-center bg-white rounded-full">
              <IoFilterSharp className="text-gray-600 ml-4" size={24} />
              <div className="w-px h-6 bg-gray-600 mx-4"></div>
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearch}
                className="py-2 text-gray-600 placeholder-gray-500 bg-transparent focus:outline-none"
              />
              <IoSearch
                className="text-gray-600 mr-4 cursor-pointer transition-colors duration-300 hover:text-blue-500"
                size={24}
              />
            </div>
            <div
              className="bg-white p-3 rounded-full border border-[#BCA8EA] cursor-pointer hover:bg-[#BCA8EA] hover:text-white transition-colors duration-100"
              onClick={handleRefresh}
            >
              <FiRefreshCcw />
            </div>
          </div>
          <Table rows={filteredRows || []} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
};

export default ChartAccount;
