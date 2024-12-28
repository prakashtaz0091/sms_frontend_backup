import React, { useState, useRef, useEffect, useContext } from "react";
import { FaHandPaper } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { FiRefreshCcw } from "react-icons/fi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";
import Table from "./Components/StudentTable";
import SearchCompo from "./Components/StdSearch";
import { AuthContext } from "../../../context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Function to get the number of days in a given month and year
const getMonthDates = (year, month) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => i + 1);
};

const StudentAttendanceReport = () => {
  const { api } = useContext(AuthContext);
  const [classList, setClassList] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  useEffect(() => {
    const loadClassListFromServer = async () => {
      try {
        const response = await api.get("/get_classes_for_config/");

        setClassList(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    loadClassListFromServer();
  }, [api]);

  const now = new Date();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(now.getMonth());
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");

  // Get dates for the currently selected month
  const dates = getMonthDates(year, currentMonthIndex);

  const [students, setStudents] = useState([]);

  // Handle month changes
  const handlePreviousMonth = () => {
    if (month == 1) {
      const newMonth = 12;
      const newYear = year - 1;
      getClassAttendanceByMonth(newYear, newMonth);
      setYear(newYear);
      setMonth(newMonth);
    } else {
      const newMonth = month - 1;
      getClassAttendanceByMonth(year, newMonth);
      setMonth(newMonth);
    }
  };

  const handleNextMonth = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const validMonth = month <= currentMonth;
    const currentYear = now.getFullYear();
    const validYear = year <= currentYear;
    if (validYear && validMonth) {
      if (month == 12) {
        const newYear = year + 1;
        const newMonth = 1;
        getClassAttendanceByMonth(newYear, newMonth);
        setYear(newYear);
        setMonth(newMonth);
      } else {
        const newMonth = month + 1;
        getClassAttendanceByMonth(year, newMonth);
        setMonth(newMonth);
      }
    }
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // References for date and attendance scroll containers
  const dateScrollRef = useRef(null);
  const attendanceScrollRefs = useRef([]);

  // Sync scroll positions of date and attendance
  const handleDateScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    attendanceScrollRefs.current.forEach((ref) => {
      if (ref) ref.scrollLeft = scrollLeft;
    });
  };

  // Sync attendance scroll with date scroll on initial render
  useEffect(() => {
    if (dateScrollRef.current) {
      const scrollLeft = dateScrollRef.current.scrollLeft;
      attendanceScrollRefs.current.forEach((ref) => {
        if (ref) ref.scrollLeft = scrollLeft;
      });
    }
  }, []);

  const [selectedDate, setSelectedDate] = useState("");
  // const [filteredStudents, setFilteredStudents] = useState(students);

  const getClassAttendanceByMonth = async (year, month) => {
    try {
      const response = await api.get(
        `/get_class_attendance_by_month/${year}/${month}/${selectedClass}/`
      );
      // console.log(response.data);
      setStudents(response.data);
    } catch (error) {
      // alert(error.data.message);
      setStudents([]);
      alert(error.response.data.message);
    }
  };

  // Handle search functionality (Modified)
  const handleSearch = () => {
    if (!selectedDate || !selectedClass) {
      alert("Please select both date and class.");
      return;
    }
    const newMonth = parseInt(selectedDate.getMonth() + 1);
    const newYear = parseInt(selectedDate.getFullYear());
    getClassAttendanceByMonth(newYear, newMonth);
    setYear(newYear);
    setMonth(newMonth);
  };

  // Handle refresh functionality (Modified)
  const handleRefresh = () => {
    setSelectedClass("");
    setSelectedDate("");
    setFilteredStudents(students); // Reset to original data
  };

  return (
    <div className="bg-pink-100 p-8 min-h-screen">
      <div className="flex gap-4 bg-white rounded-3xl p-2">
        <div className="flex items-center space-x-2">
          <FaHandPaper className="text-gray-700" />
          <span className="text-gray-700 font-medium">Attendance</span>
        </div>

        {/* Vertical divider */}
        <div className="border-l border-gray-700 h-6"></div>

        {/* "Add New" text */}
        <div>
          <span className="text-gray-700 font-medium">
            Student Attendance Report
          </span>
        </div>
      </div>

      <div className="flex justify-between my-10">
        <div className="flex gap-4 items-center">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="rounded-3xl bg-white p-2 border border-gray-300"
          >
            <option value="" selected disabled>
              Select Class
            </option>
            {classList &&
              classList.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
          </select>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
              const month = parseInt(date.getMonth() + 1);
              const year = parseInt(date.getFullYear());
              setMonth(month);
              setYear(year);
            }}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            className="p-2 rounded-3xl border border-gray-300 text-center w-32 cursor-pointer"
            placeholderText="mm-yyy"
          />
          <div
            className="bg-white p-2 px-4 rounded-full border border-gray-300 hover:bg-indigo-200"
            onClick={handleSearch}
          >
            <IoSearch className="cursor-pointer transition-colors duration-300 hover:text-blue-500 text-xl" />
          </div>
        </div>
        <div className="flex flex-row gap-4 justify-end items-center">
          <div
            className="border border-[#BCA8EA] p-2 bg-white rounded-full cursor-pointer transition-all duration-200 hover:bg-[#F3E8FF] hover:shadow-lg"
            onClick={handleRefresh}
          >
            <FiRefreshCcw className="text-gray-600 transition-transform duration-200 hover:rotate-180 text-xl" />
          </div>
        </div>
      </div>

      {/* Months Slider */}
      <div className="flex items-center justify-center mb-4">
        <button onClick={handlePreviousMonth}>
          <FaChevronLeft className="text-gray-600 hover:text-gray-800" />
        </button>
        <h2 className="mx-4 text-lg font-semibold">
          {month ? months[month - 1] : ""} {year && year}
        </h2>
        <button onClick={handleNextMonth}>
          <FaChevronRight className="text-gray-600 hover:text-gray-800" />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white py-4 rounded-lg shadow-lg">
        <div className="overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white">
                <th className="p-2 text-center">Roll No.</th>
                <th className="p-2 text-center">Name</th>
                <th className="p-2 text-center">Class</th>
                <th className="p-2 text-center">
                  <p className="">Date</p>

                  {/* Scrollable Dates */}
                  <div
                    ref={dateScrollRef}
                    onScroll={handleDateScroll}
                    className="flex overflow-x-auto max-w-[500px]"
                  >
                    <div className="flex">
                      {students.length > 0 ? (
                        Object.keys(students[0].status).map((date) => (
                          <div
                            key={date}
                            className="p-2 min-w-[40px] text-center"
                          >
                            {date}
                          </div>
                        ))
                      ) : (
                        <div className="p-2 ">loading...</div>
                      )}
                    </div>
                  </div>
                </th>
                <th className="p-2">Total P</th>
                <th className="p-2">Total A</th>
                <th className="p-2">Total L</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 &&
                students.map((student, index) => (
                  <tr
                    key={student.rollNo}
                    className={
                      index % 2 === 0 ? "bg-[#BCA8EA]" : "bg-[#E3D6FF]"
                    }
                  >
                    <td className="p-2 text-center">{student.rollNo}</td>
                    <td className="p-2 text-center">{student.name}</td>
                    <td className="p-2 text-center">{student.className}</td>
                    <td className="p-2">
                      <div
                        ref={(el) => (attendanceScrollRefs.current[index] = el)}
                        className="flex overflow-x-hidden max-w-[500px]" // Changed overflow to hidden
                      >
                        <div className="flex">
                          {Object.values(student.status).map((status, i) => (
                            <div
                              key={`${student.rollNo}-${i}-${status}`}
                              className="p-2 min-w-[40px] text-center"
                            >
                              {status === "" ? "--" : status}
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="p-2 text-center">{student.totalP}</td>
                    <td className="p-2 text-center">{student.totalA}</td>
                    <td className="p-2 text-center">{student.totalL}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 pl-2">
        <div className="flex items-center space-x-2">
          {[10, 25, 50].map((size) => (
            <button className="p-2 px-3 rounded-full border border-gray-300">
              {size}
            </button>
          ))}
          <span className="text-sm">Records per page</span>
        </div>

        <div className="flex space-x-1 items-center pr-2">
          <p>Showing 1 to 10 of 15 records</p>
          <button className="p-1 rounded-full border border-gray-300">
            <MdChevronLeft size={24} />
          </button>
          <p className="border border-gray-300 px-3 py-1 rounded-full">1</p>
          <button className="p-1 rounded-full border border-gray-300">
            <MdChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Search */}
      <SearchCompo />
      <Table />
    </div>
  );
};

export default StudentAttendanceReport;
