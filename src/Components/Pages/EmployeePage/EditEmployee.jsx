import React, { useState, useRef, useContext, useEffect } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import { MdBusinessCenter } from "react-icons/md";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { updateFormValidationSchema } from "./EmpUpdateValidations";
// import DistrictStates from "./DistrictStates";
import statesDistricts from "../SignUp&SignIn/statesDistricts.json";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { sub } from "date-fns";
function EditEmployee() {
  const navigate = useNavigate();
  const location = useLocation();
  const [employee, setEmployee] = useState(location.state?.employee || {});

  const { api } = useContext(AuthContext);
  const [roles, setRoles] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const getRoles = async () => {
      try {
        const response = await api.get("/get_roles/");

        if (response.data.length > 0) {
          setRoles(response.data);
        } else {
          alert("Please request admin to add roles first, then try again");
          navigate("/employees/allEmployees");
        }
      } catch (error) {
        alert("Something went wrong");
        // console.error("Error fetching roles:", error);
      }
    };

    getRoles();

    const getSubjects = async () => {
      try {
        const response = await api.get("/get_subjects_for_config/");

        if (response.data.length > 0) {
          setSubjects(response.data);
        } else {
          alert("Please add subjects first, then try again");
          navigate("/config/createSub");
        }
      } catch (error) {
        alert("Something went wrong");
        // console.error("Error fetching subjects:", error);
      }
    };

    getSubjects();
  }, [api]);

  const [states, setStates] = useState(getStates(statesDistricts));
  const [districts, setDistricts] = useState([]);

  const [cstates, setcStates] = useState(getStates(statesDistricts));
  const [cdistricts, setcDistricts] = useState([]);

  const fileInputRef1 = useRef(null);
  const [fileName1, setFileName1] = useState(""); // To store the file name
  const [fileSizeError, setFileSizeError] = useState(""); // To store the error message for file size

  // Handle file upload with size limit check (250 KB)
  const handleUploadClick1 = (event, setFieldValue) => {
    const file1 = event.currentTarget.files[0]; // Get the selected file
    if (file1) {
      const fileSizeInKB = file1.size / 1024; // Convert file size to KB
      if (fileSizeInKB <= 250) {
        setFieldValue("photoUpload", file1); // Set file value for Formik
        setFileName1(file1.name); // Set file name to display
        setFileSizeError(""); // Clear any previous error
      } else {
        setFileSizeError("File size must be 250KB or less."); // Set error message
        setFileName1(""); // Clear the file name if it's too large
      }
    }
  };

  const fileInputRef2 = useRef(null);
  const [fileName2, setFileName2] = useState(""); // To store the file name
  const [fileSizeError2, setFileSizeError2] = useState(""); // To store the error message for file size

  // Handle file upload with size limit check (250 KB)
  const handleUploadClick2 = (event, setFieldValue) => {
    const file = event.currentTarget.files[0]; // Get the selected file
    if (file) {
      const fileSizeInKB = file.size / 1024; // Convert file size to KB
      if (fileSizeInKB <= 250) {
        setFieldValue("bioData", file); // Set file value for Formik
        setFileName2(file.name); // Set file name to display
        setFileSizeError2(""); // Clear any previous error
      } else {
        setFileSizeError2("File size must be 250KB or less."); // Set error message
        setFileName2(""); // Clear the file name if it's too large
      }
    }
  };

  function getStates(jsonData) {
    return jsonData.states.map((stateObj) => stateObj.state);
  }

  function getDistrictsByState(jsonData, stateName) {
    const stateObj = jsonData.states.find(
      (stateObj) => stateObj.state === stateName
    );
    return stateObj ? stateObj.districts : []; // Return districts or empty array if state not found
  }

  const handleSubmit = async (e) => {
    console.log("submitted");
    e.preventDefault();

    const FORMDATA = new FormData(e.target);
    let temp = [];


    for (const pair of FORMDATA.entries()) {
      console.log(pair);

      if (pair[0] === "complementarySubjects") {
        temp.push(parseInt(pair[1], 10));
      }
    }
    FORMDATA.set("complementarySubjects", temp);
    try {
      // / Make the API call to update the student
      const response = await api.put(`/employee/${employee.id}/`, FORMDATA);
      // console.log(response.data);
      alert("Employee updated successfully!");
      navigate("/employees/allEmployees");
    } catch (error) {
      // console.error("Failed ", error.response);
      // Handle error (e.g., show a notification)
    }
  };

  return employee && roles && subjects ? (
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
          <span className="text-gray-700 font-medium">Edit</span>
        </div>
      </div>

      {/* Form Data */}
      <Formik
        initialValues={employee}
        validationSchema={updateFormValidationSchema}
        onSubmit={handleSubmit}
        validateOnChange={true}
      >
        {({ setFieldValue, values, setValues, resetForm }) => (
          <Form className=" " onSubmit={handleSubmit}>
            <div className="my-8 text-center">
              <h2 className="text-3xl font-bold text-black">
                Edit Employee Details
              </h2>
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
                  <Field
                    name="employeeFirstName"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
                  />
                  <ErrorMessage
                    name="employeeFirstName"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    Middle Name
                  </label>
                  <Field
                    name="employeeMiddleName"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
                  />
                </div>

                <div className="mb-4">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    Last Name
                  </label>
                  <Field
                    name="employeeLastName"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
                  />
                  <ErrorMessage
                    name="employeeLastName"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Gender */}
                <div className="mb-4">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    Gender
                  </label>
                  <Field
                    as="select"
                    name="gender"
                    className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-3xl"
                  >
                    <option value=""> Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Field>
                  <ErrorMessage
                    name="gender"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Date of Birth */}
                <div className="mb-4">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    Date of Birth
                  </label>
                  <Field
                    type="date"
                    name="dateOfBirth"
                    className="mt-1 block w-full p-2 rounded-3xl"
                  />
                  <ErrorMessage
                    name="dateOfBirth"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Employee Photo */}
                <div className="relative mb-4">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    Employee Photo
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef1}
                    style={{ display: "none" }}
                    accept="image/*" // Accept only image files
                    name="photoUpload"
                    onChange={(event) =>
                      handleUploadClick1(event, setFieldValue)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef1.current.click()}
                    className="w-full bg-white border border-gray-300 rounded-3xl px-4 p-2 flex flex-row items-start justify-between"
                  >
                    <span
                      className="overflow-hidden text-ellipsis whitespace-nowrap"
                      style={{ maxWidth: "80%" }} // Adjust to control the space for the file name
                    >
                      {fileName1 ? fileName1 : "Upload Photo"}
                    </span>
                    <MdOutlineFileUpload />
                  </button>
                  {fileSizeError && (
                    <span className="text-red-500 text-sm">
                      {fileSizeError}
                    </span>
                  )}
                  <ErrorMessage
                    name="photoUpload"
                    component="span"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-6  gap-4">
                {/* Aadhar Number */}
                <div className="mb-4 col-span-2">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    Aadhar Number
                  </label>
                  <Field
                    name="aadharNumber"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
                  />
                  <ErrorMessage
                    name="aadharNumber"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    Phone Number
                  </label>
                  <Field
                    name="phoneNumber"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
                  />
                  <ErrorMessage
                    name="phoneNumber"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Phone Number */}
                <div className="mb-4">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    Alternate Phone No.
                  </label>
                  <Field
                    name="alternatePhoneNumber"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
                  />
                  <ErrorMessage
                    name="alternatePhoneNumber"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    Email
                  </label>
                  <Field
                    name="email"
                    type="email"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    Employee Role
                  </label>
                  <Field
                    as="select"
                    name="selectRole"
                    className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-3xl"
                  >
                    <option value="" disabled selected>
                      Select Role
                    </option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="selectRole"
                    component="p"
                    className="text-red-500 text-sm"
                  />
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
                  <Field
                    name="fatherFirstName"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
                  />
                  <ErrorMessage
                    name="fatherFirstName"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>
                {/* Father's Middle Name */}
                <div className="mb-4">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    Father's Middle Name
                  </label>
                  <Field
                    name="fatherMiddleName"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
                  />
                </div>
                {/* Father's Last Name */}
                <div className="mb-4">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    Father's Last Name
                  </label>
                  <Field
                    name="fatherLastName"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
                  />
                  <ErrorMessage
                    name="fatherLastName"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    Husband's First Name
                  </label>
                  <Field
                    name="husbandFirstName"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
                  />
                  <ErrorMessage
                    name="husbandFirstName"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    Husband's Middle Name
                  </label>
                  <Field
                    name="husbandMiddleName"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
                  />
                </div>

                <div className="mb-4">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    Husband's Last Name
                  </label>
                  <Field
                    name="husbandLastName"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
                  />
                  <ErrorMessage
                    name="husbandLastName"
                    component="p"
                    className="text-red-500 text-sm"
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
                  <Field
                    name="address1"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
                  />
                  <ErrorMessage
                    name="address1"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-4 col-span-2">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    Town/Village/City
                  </label>
                  <Field
                    name="townVillageCity"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
                  />
                  <ErrorMessage
                    name="townVillageCity"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    Country
                  </label>
                  <Field
                    as="select"
                    name="country"
                    className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-3xl"
                  >
                    <option value="" disabled selected>
                      Country
                    </option>
                    <option value="india">India</option>
                  </Field>
                  <ErrorMessage
                    name="country"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="mb-4 ">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    State
                  </label>
                  <Field
                    as="select"
                    name="state"
                    className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-3xl"
                    onChange={(event) => {
                      const selectedState = event.target.value;
                      const filteredDistricts = getDistrictsByState(
                        statesDistricts,
                        selectedState
                      );
                      setFieldValue("state", selectedState); // Update state in Formik
                      setFieldValue("district", ""); // Clear district when state changes
                      setDistricts(filteredDistricts); // Update districts for the selected state
                    }}
                  >
                    <option value="" disabled selected>
                      State
                    </option>

                    {states.map((state, index) => (
                      <option key={index} value={state}>
                        {state}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="state"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    District
                  </label>
                  <Field
                    as="select"
                    name="district"
                    className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-3xl"
                  >
                    <option value="" disabled selected>
                      District
                    </option>

                    {districts.map((district, index) => (
                      <option key={index} value={district}>
                        {district}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="district"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    Pin Code
                  </label>
                  <Field
                    name="zipCode"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
                  />
                  <ErrorMessage
                    name="zipCode"
                    component="p"
                    className="text-red-500 text-sm"
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
                  <Field
                    type="checkbox"
                    name="sameAsPermanentAddress"
                    className="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded-3xl"
                    onChange={(e) => {
                      const isChecked = e.target.checked;

                      if (isChecked) {
                        // Batch update current address fields using setValues
                        const selectedState = values.state;
                        const filteredDistricts = getDistrictsByState(
                          statesDistricts,
                          selectedState
                        );

                        setcDistricts(filteredDistricts); // Update districts for the selected state
                        setValues({
                          ...values,
                          sameAsPermanentAddress: true,
                          currentAddress1: values.address1,
                          currentTownVillageCity: values.townVillageCity,
                          currentCountry: values.country,
                          currentState: values.state,
                          currentDistrict: values.district,
                          currentZipCode: values.zipCode,
                        });
                      } else {
                        // Clear current address fields
                        setValues({
                          ...values,
                          sameAsPermanentAddress: false,
                          currentAddress1: "",
                          currentTownVillageCity: "",
                          currentState: "",
                          currentDistrict: "",
                          currentCountry: "",
                          currentZipCode: "",
                        });
                      }
                    }}
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
                  <Field
                    name="currentAddress1"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
                  />
                </div>

                <div className="mb-4 col-span-2">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    Town/Village/City
                  </label>
                  <Field
                    name="currentTownVillageCity"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
                  />
                </div>
                <div className="mb-4">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    Country
                  </label>
                  <Field
                    as="select"
                    name="currentCountry"
                    className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-3xl"
                  >
                    <option value="" disabled selected>
                      Country
                    </option>
                    <option value="india">India</option>
                  </Field>
                </div>

                <div className="mb-4">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    State
                  </label>
                  <Field
                    as="select"
                    name="currentState"
                    className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-3xl"
                    onChange={(event) => {
                      const selectedState = event.target.value;
                      const filteredDistricts = getDistrictsByState(
                        statesDistricts,
                        selectedState
                      );
                      setFieldValue("currentState", selectedState); // Update state in Formik
                      setFieldValue("currentDistrict", ""); // Clear district when state changes
                      setcDistricts(filteredDistricts); // Update districts for the selected state
                      console.log("changed state");
                    }}
                  >
                    <option value="" disabled selected>
                      State
                    </option>
                    {cstates.map((state, index) => (
                      <option key={index} value={state}>
                        {state}
                      </option>
                    ))}
                  </Field>
                </div>

                <div className="mb-4">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    District
                  </label>
                  <Field
                    as="select"
                    name="currentDistrict"
                    className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-3xl"
                  >
                    <option value="" disabled selected>
                      District
                    </option>
                    {cdistricts.map((district, index) => (
                      <option key={index} value={district}>
                        {district}
                      </option>
                    ))}
                  </Field>
                </div>

                <div className="mb-4">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    Pin Code
                  </label>
                  <Field
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
                  <Field
                    type="date"
                    name="dateOfJoining"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
                  />
                  <ErrorMessage
                    name="dateOfJoining"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    Nationality
                  </label>
                  <Field
                    name="nationality"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
                  />
                  <ErrorMessage
                    name="nationality"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    Religion
                  </label>
                  <Field
                    as="select"
                    name="religion"
                    className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-3xl"
                  >
                    <option value="" disabled selected>
                      Religion
                    </option>
                    <option value="Class 1">Sikh</option>
                    <option value="Class 2">Hindu</option>
                    <option value="Class 3">Muslim</option>
                  </Field>
                </div>
                <div className="mb-4">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    Caste
                  </label>
                  <Field
                    as="select"
                    name="caste"
                    className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-3xl"
                  >
                    <option value="" disabled selected>
                      Caste
                    </option>
                    <option value="Class 1">Brahimin</option>
                    <option value="Class 2">Chettri</option>
                    <option value="Class 3">Muslim</option>
                  </Field>
                </div>{" "}
                <div className="mb-4 ">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    Blood Group
                  </label>
                  <Field
                    as="select"
                    name="bloodGroup"
                    className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-3xl"
                  >
                    <option value="" disabled selected>
                      BloodGroup
                    </option>
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="AB+">AB+</option>
                    <option value="O-">O-</option>
                  </Field>
                  <ErrorMessage
                    name="bloodGroup"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="relative mb-4">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    Upload Biodata
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef2}
                    style={{ display: "none" }}
                    accept=".pdf, .doc, .docx" // Accept only document files (modify as needed)
                    onChange={(event) =>
                      handleUploadClick2(event, setFieldValue)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef2.current.click()}
                    className="w-full bg-white border border-gray-300 rounded-3xl px-4 p-2 flex flex-row items-start justify-between"
                  >
                    <span
                      className="overflow-hidden text-ellipsis whitespace-nowrap"
                      style={{ maxWidth: "80%" }} // Adjust to control the space for the file name
                    >
                      {fileName2 ? fileName2 : " Biodata"}
                    </span>
                    <MdOutlineFileUpload />
                  </button>
                  {fileSizeError2 && (
                    <span className="text-red-500 text-sm">
                      {fileSizeError2}
                    </span>
                  )}
                  <ErrorMessage
                    name="bioData"
                    component="span"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-6 gap-4">
                <div className="mb-4 col-span-2">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    Educational Qualification
                  </label>
                  <Field
                    name="educationalDetails"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
                  />
                  <ErrorMessage
                    name="educationalDetails"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    Experience
                  </label>
                  <Field
                    name="experience"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
                  />
                  <ErrorMessage
                    name="experience"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-4 ">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    Main Subject
                  </label>
                  <Field
                    as="select"
                    name="mainSubject"
                    className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-3xl"
                  >
                    <option value="" disabled selected>
                      Main Subject
                    </option>
                    {subjects &&
                      subjects.map((subject) => (
                        <option value={parseInt(subject.id)}>
                          {subject.name}
                        </option>
                      ))}
                  </Field>
                  <ErrorMessage
                    name="mainSubject"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Complementry subjects */}
                <div className="mb-4 col-span-2">
                  <label className="font-sans text-base font-bold leading-5 text-left">
                    Complimentary Subjects
                  </label>
                  <Field
                    as="select"
                    multiple
                    name="complementarySubjects"
                    className="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-3xl"
                  >
                    {subjects &&
                      subjects.map((subject) => {
                        if (subject.id !== parseInt(values.mainSubject)) {
                          return (
                            <option value={parseInt(subject.id)}>
                              {subject.name}
                            </option>
                          );
                        }
                      })}
                  </Field>
                </div>
              </div>
              <div className=" mb-4">
                <label
                  htmlFor=""
                  className="font-sans text-base font-bold leading-5 text-left"
                >
                  Remarks (note)
                </label>
                <Field
                  name="remarks"
                  placeholder="Details"
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-3xl"
                />
              </div>
            </section>

            <div className="flex flex-row justify-center gap-6 py-10">
              <div className="">
                <button
                  type="submit"
                  className="bg-pink-500 text-white font-semibold px-6 py-2 rounded-3xl shadow-md hover:bg-pink-600"
                // onClick={(e) => handleSubmit(e)}
                >
                  Submit
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  ) : (
    <div>...Loading</div>
  );
}

export default EditEmployee;
