import React, { useState, useRef, useContext, useEffect } from "react";
import { MdBusinessCenter } from "react-icons/md";
import { AuthContext } from "../../../context/AuthContext";
import { useLocation } from "react-router-dom";

function ViewEmployee() {
  const { api } = useContext(AuthContext);

  const location = useLocation(); // Get location object
  const { state } = location || {}; // Destructure state from location safely

  const getEmployeeData = async () => {
    try {
      const response = await api.get(`/get_employee/`);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };


  useEffect(() => {
    if (state) {
      const employeeId = state.employeeId;
      console.log(employeeId);                

      get



    }
  }, [state]);

  return (
    <div className="bg-pink-100 min-h-screen p-8">
      <div className="flex gap-4  bg-white  rounded-3xl p-2">
        <div className="flex items-center space-x-2">
          <MdBusinessCenter className="text-gray-700" />
          <span className="text-gray-700 font-medium">Employee</span>
        </div>

        {/* Vertical divider */}
        <div className="border-l border-gray-700 h-6"></div>

        {/* "Add New" text */}
        <div>
          <span className="text-gray-700 font-medium">Add New</span>
        </div>
      </div>

      <div className=" ">
        <div className="my-8 text-center">
          <h2 className="text-3xl font-bold text-black">Employee Form</h2>
        </div>

        {/* Employee Information */}

        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <span className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">
              1
            </span>
            <span>Basic Information</span>
          </h3>
          <hr className="border-gray-600" />
          <div className="grid grid-cols-6  gap-4 mt-6">
            <div className="mb-4">
              <label className="font-sans text-base font-bold leading-5 text-left">
                First Name
              </label>
              <div
                name="employeeFirstName"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
              />
            </div>

            <div className="mb-4">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Middle Name
              </label>
              <div
                name="employeeMiddleName"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
              />
            </div>

            <div className="mb-4">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Last Name
              </label>
              <div
                name="employeeLastName"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
              />
            </div>

            {/* Gender */}
            <div className="mb-4">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Gender
              </label>
              <div
                name="gender"
                className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-3xl"
              ></div>
            </div>

            {/* Date of Birth */}
            <div className="mb-4">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Date of Birth
              </label>
              <div
                type="date"
                name="dateOfBirth"
                className="mt-1 block w-full p-2 rounded-3xl"
              />
            </div>

            {/* Employee Photo */}
            <div className="relative mb-4">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Employee Photo
              </label>
              <div
                type="file"
                style={{ display: "none" }}
                accept="image/*" // Accept only image files
              />
              <button
                type="button"
                className="w-full bg-white border border-gray-300 rounded-3xl px-4 p-2 flex flex-row items-start justify-between"
              >
                <span
                  className="overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{ maxWidth: "80%" }} // Adjust to control the space for the file name
                ></span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-6  gap-4">
            {/* Aadhar Number */}
            <div className="mb-4 col-span-2">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Aadhar Number
              </label>
              <div
                name="aadharNumber"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
              />
            </div>

            <div className="mb-4">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Phone Number
              </label>
              <div
                name="phoneNumber"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
              />
            </div>

            {/* Phone Number */}
            <div className="mb-4">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Alternate Phone No.
              </label>
              <div
                name="alternatePhoneNumber"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
              />
            </div>
            <div className="mb-4">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Email
              </label>
              <div
                name="email"
                type="email"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
              />
            </div>

            <div className="mb-4">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Employee Role
              </label>
              <div
                name="selectRole"
                className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-3xl"
              ></div>
            </div>
          </div>
        </section>

        {/* Father & Husband Name */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <span className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">
              2
            </span>
            <span>Father / Husband Name</span>
          </h3>
          <hr className="border-gray-600" />
          <div className="grid grid-cols-6  gap-4 mt-6">
            {/* Father's First Name */}
            <div className="mb-4">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Father's First Name
              </label>
              <div
                name="fatherFirstName"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
              />
            </div>
            {/* Father's Middle Name */}
            <div className="mb-4">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Father's Middle Name
              </label>
              <div
                name="fatherMiddleName"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
              />
            </div>
            {/* Father's Last Name */}
            <div className="mb-4">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Father's Last Name
              </label>
              <div
                name="fatherLastName"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
              />
            </div>

            <div className="mb-4">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Husband's First Name
              </label>
              <div
                name="husbandFirstName"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
              />
            </div>

            <div className="mb-4">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Husband's Middle Name
              </label>
              <div
                name="husbandMiddleName"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
              />
            </div>

            <div className="mb-4">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Husband's Last Name
              </label>
              <div
                name="husbandLastName"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
              />
            </div>
          </div>
        </section>

        {/* Permanent Address */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <span className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">
              3
            </span>
            <span>Permanent Address</span>
          </h3>
          <hr className="border-gray-600" />
          <div className="grid grid-cols-7 gap-4 mt-6">
            <div className="mb-4 col-span-2">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Address 1
              </label>
              <div
                name="address1"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
              />
            </div>

            <div className="mb-4 col-span-2">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Town/Village/City
              </label>
              <div
                name="townVillageCity"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
              />
            </div>
            <div className="mb-4">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Country
              </label>
              <div
                name="country"
                className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-3xl"
              ></div>
            </div>
            <div className="mb-4 ">
              <label className="font-sans text-base font-bold leading-5 text-left">
                State
              </label>
              <div
                name="state"
                className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-3xl"
              ></div>
            </div>

            <div className="mb-4">
              <label className="font-sans text-base font-bold leading-5 text-left">
                District
              </label>
              <div
                name="district"
                className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-3xl"
              ></div>
            </div>

            <div className="mb-4">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Pin Code
              </label>
              <div
                name="zipCode"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
              />
            </div>
          </div>
        </section>

        {/* Current Address */}
        <section className="mb-8">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold  flex items-center">
              <span className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">
                4
              </span>
              <span>Current Address</span>
            </h3>
            <div className="flex items-center mb-4 mt-6">
              <div
                type="checkbox"
                name="sameAsPermanentAddress"
                className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded-3xl"
              />

              <label className="text-sm">Same as Permanent Address</label>
            </div>
          </div>
          <hr className="border-gray-600" />

          <div className="grid grid-cols-7 gap-4 pt-4">
            <div className="mb-4 col-span-2">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Address 1
              </label>
              <div
                name="currentAddress1"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
              />
            </div>

            <div className="mb-4 col-span-2">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Town/Village/City
              </label>
              <div
                name="currentTownVillageCity"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
              />
            </div>
            <div className="mb-4">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Country
              </label>
              <div
                name="currentCountry"
                className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-3xl"
              ></div>
            </div>

            <div className="mb-4">
              <label className="font-sans text-base font-bold leading-5 text-left">
                State
              </label>
              <div
                name="currentState"
                className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-3xl"
              ></div>
            </div>

            <div className="mb-4">
              <label className="font-sans text-base font-bold leading-5 text-left">
                District
              </label>
              <div
                name="currentDistrict"
                className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-3xl"
              ></div>
            </div>

            <div className="mb-4">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Pin Code
              </label>
              <div
                name="currentZipCode"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
              />
            </div>
          </div>
        </section>

        {/* Other informations */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <span className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">
              5
            </span>
            <span>Other Information</span>
          </h3>{" "}
          <hr className="border-gray-600" />
          <div className="grid grid-cols-6  gap-4 mb-4 mt-6">
            <div className="mb-4">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Date of Joining
              </label>
              <div
                type="date"
                name="dateOfJoining"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
              />
            </div>
            <div className="mb-4">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Nationality
              </label>
              <div
                name="nationality"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
              />
            </div>
            <div className="mb-4">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Religion
              </label>
              <div
                name="religion"
                className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-3xl"
              ></div>
            </div>
            <div className="mb-4">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Caste
              </label>
              <div
                name="caste"
                className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-3xl"
              ></div>
            </div>{" "}
            <div className="mb-4 ">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Blood Group
              </label>
              <div
                name="bloodGroup"
                className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-3xl"
              ></div>
            </div>
            <div className="relative mb-4">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Upload Biodata
              </label>
              <div
                type="file"
                style={{ display: "none" }}
                accept=".pdf, .doc, .docx" // Accept only document files (modify as needed)
              />
              <button
                type="button"
                className="w-full bg-white border border-gray-300 rounded-3xl px-4 p-2 flex flex-row items-start justify-between"
              >
                <span
                  className="overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{ maxWidth: "80%" }} // Adjust to control the space for the file name
                ></span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-4">
            <div className="mb-4 col-span-2">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Educational Qualification
              </label>
              <div
                name="educationalDetails"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
              />
            </div>

            <div className="mb-4">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Experience
              </label>
              <div
                name="experience"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
              />
            </div>

            <div className="mb-4 ">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Main Subject
              </label>
              <div
                name="mainSubject"
                className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-3xl"
              ></div>
            </div>

            {/* Complementry subjects */}
            <div className="mb-4 col-span-2">
              <label className="font-sans text-base font-bold leading-5 text-left">
                Complimentary Subjects
              </label>
              <div className="relative">
                <div className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-3xl cursor-pointer">
                  <div className="flex flex-wrap"></div>
                </div>
              </div>
            </div>
          </div>
          <div className=" mb-4">
            <label
              htmlFor=""
              className="font-sans text-base font-bold leading-5 text-left"
            >
              Remarks (note)
            </label>
            <div
              name="remarks"
              placeholder="Details"
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default ViewEmployee;
