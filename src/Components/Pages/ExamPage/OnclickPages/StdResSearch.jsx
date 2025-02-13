import React, { useRef, useState, useEffect, useContext } from "react";
import { FaEdit } from "react-icons/fa";
import { MdLocalPrintshop } from "react-icons/md";
import { AuthContext } from "../../../../context/AuthContext"; // Import the AuthContext}
import { set } from "date-fns";

const StdResSearch = () => {
  const tableRef = useRef();

  const { api } = useContext(AuthContext);

  const [studentData, setStudentData] = useState(null);

  // Define state for subjects and marks
  const [subjects, setSubjects] = useState([]);

  const [totalMarks, setTotalMarks] = useState(0);
  const [obtainedMarks, setObtainedMarks] = useState(0);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const student_result_info = JSON.parse(
      localStorage.getItem("student_result_info")
    );
    const getStudentResult = async () => {
      try {
        const response = await api.get(
          `/get_student_report/${student_result_info.exam_id}/${student_result_info.search_key}/`
        );
        console.log(response.data);

        setStudentData(response.data.student_data);

        // subjects
        const subjectsData = response.data.obtained_marks.map((subject) => ({
          subject: subject.paper_name,
          total: subject.paper_full_marks,
          obtained: subject.marks,
        }));

        setSubjects(subjectsData);
      } catch (error) {
        console.error("Error fetching student result:", error);
      }
    };
    getStudentResult();
  }, []);

  // Calculate total, obtained marks, and percentage whenever subjects change
  useEffect(() => {
    const total = subjects.reduce((sum, subject) => sum + subject.total, 0);
    const obtained = subjects.reduce(
      (sum, subject) => sum + subject.obtained,
      0
    );
    const percent = (obtained / total) * 100;

    setTotalMarks(total);
    setObtainedMarks(obtained);
    setPercentage(percent.toFixed(2));
  }, [subjects]);

  const handlePrint = () => {
    const printContents = tableRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    studentData && (
      <div className="p-8 bg-pink-100 min-h-screen">
        <div className="flex gap-4 bg-white rounded-3xl p-2">
          <div className="flex items-center space-x-2">
            <FaEdit className="text-gray-700" />
            <span className="text-gray-700 font-medium">Exam</span>
          </div>
          <div className="border-l border-gray-700 h-6"></div>
          <div>
            <span className="text-gray-700 font-medium">Result</span>
          </div>
          <div className="border-l border-gray-700 h-6"></div>
          <div>
            <span className="text-gray-700 font-medium">
              Student Wise Result
            </span>
          </div>
          <div className="border-l border-gray-700 h-6"></div>
          <div>
            <span className="text-gray-700 font-medium">Search</span>
          </div>
        </div>

        <div>
          <p className="text-center font-bold pt-10 text-2xl">Result Card</p>
          <div className="flex justify-end pt-6">
            <button
              onClick={handlePrint}
              className="bg-blue-500 px-2 py-2 rounded-md transition duration-300 hover:bg-blue-600 hover:shadow-lg hover:scale-105"
            >
              <MdLocalPrintshop size={24} className="text-black" />
            </button>
          </div>

          <div className="grid grid-cols-2 pt-8" ref={tableRef}>
            <div>
              {/* Student Details Section */}
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 bg-purple-200 rounded-full"></div>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-semibold pr-3">Enrollment ID:</span>
                    {studentData.enr_no}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold pr-3">Student Name:</span>
                    {studentData.student_name}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold pr-3">Father's Name:</span>
                    {studentData.father_name}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold pr-3">Class:</span>
                    {studentData.class_name}
                  </p>
                </div>
              </div>
            </div>

            {/* Table section */}
            <div>
              <div className="bg-white py-4 rounded-lg shadow-lg">
                <table className="w-full text-center">
                  <thead>
                    <tr>
                      <th className="p-2">Sl No.</th>
                      <th className="p-2">Subjects</th>
                      <th className="p-2">Total Mark</th>
                      <th className="p-2">Obtained Mark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((item, index) => (
                      <tr
                        key={index}
                        className={
                          index % 2 === 0 ? "bg-[#BCA8EA]" : "bg-[#E3D6FF]"
                        }
                      >
                        <td className="p-2">{`0${index + 1}`}</td>
                        <td className="p-2">{item.subject}</td>
                        <td className="p-2">{item.total}</td>
                        <td className="p-2">{item.obtained}</td>
                      </tr>
                    ))}
                    <tr className="bg-[#5011DD] text-white">
                      <td colSpan="2" className="p-2 font-semibold">
                        Total
                      </td>
                      <td className="p-2 font-semibold">{totalMarks}</td>
                      <td className="p-2 font-semibold">{obtainedMarks}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Summary Section */}
              <div className="flex justify-between space-x-8 mt-8">
                <div className="text-center">
                  <p className="font-semibold">Total Mark</p>
                  <p className="bg-white p-2 rounded-full w-24 text-center">
                    {totalMarks}
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">Obtained Mark</p>
                  <p className="bg-white p-2 rounded-full w-24 text-center">
                    {obtainedMarks}
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">Percentage</p>
                  <p className="bg-white p-2 rounded-full w-24 text-center">
                    {percentage}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default StdResSearch;
