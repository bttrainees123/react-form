import React, { useState, useEffect, useMemo } from "react";
import Pagination from "./Pagination";
let pageSize = 10
const Display = () => {
  const [userData, setUserData] = useState([]);
  const [editInd, setEditInd] = useState(null);
  const [editData, setEditData] = useState({});
  const [currPage, setCurrPage] = useState(1)

  const currData = useMemo(() => {
    const firstPageInd = (currPage - 1) * pageSize;
    const lastPageInd = firstPageInd + pageSize
    return userData.slice(firstPageInd, lastPageInd)
  }, [currPage])

  useEffect(() => {
    const storedData = localStorage.getItem("data");
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
  }, []);

  const handleDelete = (ind) => {
    const updatedData = userData.filter((_, i) => i !== ind);
    setUserData(updatedData);
    localStorage.setItem("data", JSON.stringify(updatedData));
  };

  const validateField = (field, regex, errorId) => {
    const isValid = regex.test(field);
    document.getElementById(errorId).style.display = isValid ? 'none' : 'block';
    return isValid;
  };

  const validateUserName = (username) =>
    validateField(username, /^[a-z0-9]+$/i, 'username-error');

  const validateEmail = (email) =>
    validateField(email, /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/, 'email-error');

  const validateAge = (age) => {
    const isValid = parseInt(age, 10) >= 16 && parseInt(age, 10) <= 90
    document.getElementById('age-error').style.display = isValid ? 'none' : 'block';
    return isValid;
  };

  const validateRequiredFields = () => {
    let isValid = true;
    if (!editData.gender) {
      document.getElementById('gender-error').style.display = 'block';
      isValid = false;
    }
    if (!editData.stream) {
      document.getElementById('stream-error').style.display = 'block';
      isValid = false;
    }
    if (editData.subject.length === 0) {
      document.getElementById('subject-error').style.display = 'block';
      isValid = false;
    }
    return isValid;
  };

  const handleStatusChange = (ind, val) => {
    const updatedData = [...userData];
    updatedData[ind].status = val;
    setUserData(updatedData);
    localStorage.setItem("data", JSON.stringify(updatedData));
  };

  const handleEdit = (ind) => {
    setEditInd(ind);
    console.log("Ind ", ind);
    setEditData({...userData[ind]});
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log("Name ", name);
    console.log("Value ", value);
    console.log("type ", type);
    console.log("checked ", checked);
    
    if (type === "checkbox" ) {
      setEditData((prevData) => ({
        ...prevData,
        subject: checked
          ? [...(prevData.subject), value]
          : (prevData.subject).filter((sub) => sub !== value),
      }));
      console.log("Edit Data---", editData.subject);
    } else {
      setEditData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if(
      validateUserName(editData.username) &&
      validateEmail(editData.email) &&
      validateAge(editData.age) &&
      validateRequiredFields()
    ){
    const updatedData = [...userData];
    updatedData[editInd] = editData;
    setUserData(updatedData);
    localStorage.setItem("data", JSON.stringify(updatedData));
    setEditInd(null);
    setEditData({});
    }
  };

  const mySearch = () => {
    let input = document.getElementById("myInput")
    let filter = input.value.toLowerCase();
    let tr = document.getElementsByTagName("tr")
    for(let i = 1; i < tr.length; i++){
      let textVal = tr[i].textContent || tr[i].innerText
      if(textVal.toLowerCase().indexOf(filter) > -1){
        tr[i].style.display = "";
      }
      else{
        tr[i].style.display = "none"
      }
    }
  }

  const genderOptions = ["Male", "Female", "Other"];

  const checkOption = [
    { name: 'Physics ', key: 'physics', label: 'Physics ' },
    { name: 'Chemistry ', key: 'chemistry', label: 'Chemistry ' },
    { name: 'Math ', key: 'math', label: 'Math ' },
    { name: 'Biology ', key: 'bio', label: 'Biology ' },
  ];

  const validateLocalEmail = (email) => {
    const duplicateEmailCheck = document.getElementById('duplicate-error');
    const user = JSON.parse(localStorage.getItem('data')) || [];
    const emailExist = user.some((obj) => obj.email === email);
    duplicateEmailCheck.style.display = emailExist ? 'block' : 'none';
    return emailExist;
  };

  return (
    <>
    <div>
      <input type="text" id="myInput" onKeyUp={mySearch} placeholder="search"/>

    </div>
      <table className="table-container">
        <thead>
        <tr>
          <th>Profile Pic</th>
          <th>User Name</th>
          <th>Email</th>
          <th>Gender</th>
          <th>Age</th>
          <th>Stream</th>
          <th>Subjects</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
        </thead>
        <tbody>
        {userData.length > 0 ? (
          currData.map((user, ind) => (
            <tr key={ind}>
                <td>
                  {user.file ? (
                    <img src={user.file} style={{maxWidth: "200px", }} alt="Profile Pic" />
                  ) : (
                    <p>No Profile Pic</p>
                  )}
                </td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.gender}</td>
                <td>{user.age}</td>
                <td>{user.stream}</td>
                <td>{user.subject ? user.subject : "None"}</td>
                <td>
                  <select
                    value={user.status || "Active"}
                    onChange={(e) => handleStatusChange(ind, e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleEdit(ind)}>Update</button>
                  <button onClick={() => handleDelete(ind)}>Delete</button>
                </td>
              </tr>
          ))
        ) : (
          <tr>
              <td colSpan="9">
                <h1>No data available</h1>
              </td>
            </tr>
        )}
        </tbody>

      </table>
      {editInd !== null && (
        <form className='form-controller' onSubmit={handleSave}>
        <div>Username:
          <input type='text' name="username" value={editData.username} onChange={handleChange} onInput={validateUserName} placeholder='Enter Username' minLength={6} maxLength={20} />
          <span id='username-error' style={{ display: "none" }}>Enter valid username</span>
        </div><br />
        <div>
            Select Gender:
            <select name="gender" value={editData.gender || ""} onChange={handleChange}>
              <option value="">Select</option>
              {genderOptions.map((val, ind) => (
                <option key={ind} value={val}>
                  {val}
                </option>
              ))}
            </select>
            <span id='gender-error' style={{ display: 'none'}}>Select your gender</span>
          </div><br />
        <div>Age:
          <input type='text' name="age" value={editData.age} onChange={handleChange} onInput={validateAge} />
          <span id='age-error' style={{ display: 'none' }}>Age must be greater than 16 and less than 90</span>
        </div><br />
        <div>Email:
          <input type='text' name="email" value={editData.email} onChange={handleChange} onInput={validateEmail && validateLocalEmail} />
          <span id='email-error' style={{ display: "none" }}>Enter valid Email</span>
          <span id='duplicate-error' style={{ display: "none" }}>Email already exist</span>
        </div><br />
        <div>
            Stream:
            <label>
              <input
                type="radio"
                name="stream"
                value="PCM"
                checked={editData.stream === "PCM"}
                onChange={handleChange}
              />
              PCM
            </label>
            <label>
              <input
                type="radio"
                name="stream"
                value="Commerce"
                checked={editData.stream === "Commerce"}
                onChange={handleChange}
              />
              Commerce
            </label>
            <label>
              <input
                type="radio"
                name="stream"
                value="Arts"
                checked={editData.stream === "Arts"}
                onChange={handleChange}
              />
              Arts
            </label>
            <span id='stream-error' style={{ display: 'none', color: 'red' }}>Select a stream</span>
          </div><br />
          <div>
            Subjects:
            {checkOption.map((it) => (
              <label key={it.key}>
                {it.label}
                <input
                  type="checkbox"
                  name={it.name}
                  value={it.label}
                  checked={(editData.subject).includes(it.label)}
                  onChange={handleChange}
                />
              </label>
            ))}
            <span id='subject-error' style={{ display: 'none', color: 'red' }}>Select at least one subject</span>
          </div>
        <button type="submit">Update</button>
      </form>
      )}
              <Pagination currPage={currPage} totalPage = {userData.length} pageSize = {pageSize} onPageChange={page =>setCurrPage(page)} />

    </>
  );
};

export default Display


// https://dzone.com/articles/advanced-react-js-concepts-a-deep-dive

// https://react-redux.js.org/tutorials/quick-start