import React, { useState, useRef, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";
import { AuthContext } from "../../../../context/AuthContext";

const Table = () => {
  const { api } = useContext(AuthContext);
  const [classList, setClassList] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    recordsPerPage: 10,
    totalRecords: 0,
    totalPages: 1,
  });
  const [initialStudents, setInitialStudents] = useState([]);
  const [students, setStudents] = useState(initialStudents);

  // Handle month changes
  const handlePreviousMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setYear(year - 1);
    } else {
      setCurrentMonthIndex((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setYear(year + 1);
    } else {
      setCurrentMonthIndex((prev) => prev + 1);
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

  return (
    <div>
      {/* Months Slider */}
      <div className="flex items-center justify-center mb-4">
        <button onClick={handlePreviousMonth}>
          <FaChevronLeft className="text-gray-600 hover:text-gray-800" />
        </button>
        <h2 className="mx-4 text-lg font-semibold">
          {months[currentMonthIndex]} {year}
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
                      {dates.map((date) => (
                        <div
                          key={date}
                          className="p-2 min-w-[40px] text-center"
                        >
                          {date}
                        </div>
                      ))}
                    </div>
                  </div>
                </th>
                <th className="p-2">Total P</th>
                <th className="p-2">Total A</th>
                <th className="p-2">Total L</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr
                  key={student.rollNo}
                  className={index % 2 === 0 ? "bg-[#BCA8EA]" : "bg-[#E3D6FF]"}
                >
                  <td className="p-2 text-center">{student.rollNo}</td>
                  <td className="p-2 text-center">{student.name}</td>
                  <td className="p-2 text-center">{student.class}</td>
                  <td className="p-2">
                    {/* Scrollable Attendance (Sync with Date Scroll) */}
                    <div
                      ref={(el) => (attendanceScrollRefs.current[index] = el)}
                      className="flex overflow-x-hidden max-w-[500px]" // Changed overflow to hidden
                    >
                      <div className="flex">
                        {student.attendance.map((status, i) => (
                          <div
                            key={`${student.rollNo}-${i}-${status}`}
                            className="p-2 min-w-[40px] text-center"
                          >
                            {status}
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
    </div>
  );
};

export default Table;
