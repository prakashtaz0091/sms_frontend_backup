import React, { useContext, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import {AuthContext} from "../../../context/AuthContext"

// Function to filter the data based on date
const filterExpenses = (expenses, filterType, fromDate, toDate) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  if (filterType === "thisMonth") {
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date.split("-").reverse().join("-"));
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });
  } else if (filterType === "range" && fromDate && toDate) {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date.split("-").reverse().join("-"));
      return expenseDate >= from && expenseDate <= to;
    });
  }

  return expenses;
};

const StatementTable = ({ filterType, fromDate, toDate }) => {

  const {api} = useContext(AuthContext);

  

  const [incomeExpenses, setIncomeExpenses] = useState([]);

  useEffect(() => {
    const getIncomeExpenses = async () => {
      try {
        const response = await api.get("/get_income_expenses/");
        // setExpenses(response.data);
        // console.log(response.data);
        setIncomeExpenses(response.data);
        
      } catch (error) {
        console.error("Error fetching income and expenses:", error);
      }
    }

    getIncomeExpenses();

}, [api]);

  // Filter the data based on filterType
  const filteredIncomeExpenses = filterExpenses(incomeExpenses, filterType, fromDate, toDate);

  // Total income and expense calculations
      const totalExpense = filteredIncomeExpenses
      .filter(item => item.head_type === "expense") // Filter only expenses
      .reduce((acc, item) => acc + parseFloat(item.amount), 0);

    const totalIncome = filteredIncomeExpenses
      .filter(item => item.head_type === "income") // Filter only income
      .reduce((acc, item) => acc + parseFloat(item.amount), 0);  const profitOrLoss = totalIncome - totalExpense;

  // Function to delete a row
  const handleDelete = (id) => {
    // Show confirmation dialog
    const confirmDelete = window.confirm("Are you sure you want to delete this expense?");
    
    // Proceed with deletion if confirmed
    if (confirmDelete) {
        const updatedExpenses = incomeExpenses.filter(item => item.id !== id);
        setIncomeExpenses(updatedExpenses);


        // Make the API call to delete the expense
        const deleteIncomeExpense = async () => {
          try {
            const response = await api.delete(`/delete_income_expense/${id}/`);
            alert("IncomeExpense deleted successfully.");
          } catch (error) {
            alert("Failed to delete expense.");
          }
        }

        deleteIncomeExpense();
    }
};


  return (
    <div className="bg-white rounded-2xl shadow-lg">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="p-4">Date</th>
            <th className="p-2">Description</th>
            <th className="p-2">Expense</th>
            <th className="p-2">Income</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredIncomeExpenses.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-4 text-gray-500">
                No data found
              </td>
            </tr>
          ) : (
            filteredIncomeExpenses.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-[#BCA8EA]" : "bg-[#E3D6FF]"}>
                <td className="p-3 pl-3">{item.date}</td>
                <td className="p-3 pl-3">{item.head_name}-({item.particulars && item.particulars})</td>
                <td className="p-3 pl-3 text-black">{item.head_type === "expense" ? item.amount : ""}</td>
                <td className="p-3 pl-3 text-black">{item.head_type === "income" ? item.amount : ""}</td>
                <td className="p-3 pl-6">
                  <button onClick={() => handleDelete(item.id)} className=" text-white px-2 py-2 rounded-md transition duration-300 hover:bg-red-600 hover:shadow-lg hover:scale-105">
                    <MdDelete className="text-black"/>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          <tr>
            <td className="p-2 font-bold" colSpan="2">
              Total
            </td>
            <td className="p-2 text-red-500">{totalExpense.toLocaleString()}</td>
            <td className="p-2 text-green-500">{totalIncome.toLocaleString()}</td>
            <td className="p-2"></td>
          </tr>
          <tr>
            <td className="p-2" colSpan="5">
              <div className="border border-gray-500 p-2">
                <span className="font-bold">Profit / Loss - </span>
                <span className={profitOrLoss >= 0 ? "text-green-500" : "text-red-500"}>
                  {profitOrLoss.toLocaleString()}
                </span>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default StatementTable;
