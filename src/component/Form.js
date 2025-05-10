import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Form = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const [userName, setUserName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [subject, setSubject] = useState([]);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const genderInputRef = useRef()
  const navigate = useNavigate()

  const handleRadioChange = (val) => {
    setSelectedValue(val);
    document.getElementById('stream-error').style.display = 'none';
  }

  const handleSubjectChange = (val) => {
    console.log(val.target.name, "     ", val.target.checked);
    const newArr = [...subject];
    if (val.target.checked) {
      newArr.push(val.target.name)
    }
    else {
      newArr.splice(newArr.indexOf(val.target.key), 1)
    }
    setSubject(newArr)
  };

  const handlePasswordChange = (val) => {
    setPassword(val.target.value);
    document.getElementById('password-error').style.display = 'none';
  };

  const handleConfirmPasswordChange = (val) => {
    setConfirmPassword(val.target.value);
    document.getElementById('cPassword-error').style.display = 'none';
  };

  const checkOption = [
    { name: 'Physics ', key: 'physics', label: 'Physics ' },
    { name: 'Chemistry ', key: 'chemistry', label: 'Chemistry ' },
    { name: 'Math ', key: 'math', label: 'Math ' },
    { name: 'Biology ', key: 'bio', label: 'Biology ' },
  ];

  const handleProfilePic = (val) => {
    const file = val.target.files[0]
    if (file) {
      const read = new FileReader()
      read.onloadend = () => {
        setFile(read.result)
      }
      read.readAsDataURL(file)
    }
  };

  const validateField = (field, regex, errorId) => {
    const isValid = regex.test(field);
    document.getElementById(errorId).style.display = isValid ? 'none' : 'block';
    return isValid;
  };

  const validateUserName = (username) =>
    validateField(username, /^[a-z0-9]+$/i, 'username-error');

  const comparePassword = (password, confirmPassword) => {
    const isValid = password === confirmPassword;
    document.getElementById('cPassword-error').style.display = isValid ? 'none' : 'block';
    return isValid;
  };

  const validateRequiredFields = () => {
    let isValid = true;
    if (!gender) {
      document.getElementById('gender-error').style.display = 'block';
      isValid = false;
    }
    if (!selectedValue) {
      document.getElementById('stream-error').style.display = 'block';
      isValid = false;
    }
    if (subject.size === 0) {
      document.getElementById('subject-error').style.display = 'block';
      isValid = false;
    }
    return isValid;
  };

  const handleGenderChange = (val) => {
    setGender(val);
    document.getElementById('gender-error').style.display = val === 'select' ? 'block' : 'none';
  };

  const validateEmail = (email) =>
    validateField(email, /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,6}$/, 'email-error');

  const validateAge = (age) => {
    const isValid = parseInt(age, 10) >= 16 && parseInt(age, 10) <= 90
    document.getElementById('age-error').style.display = isValid ? 'none' : 'block';
    return isValid;
  };

  const validatePassword = (password) =>
    validateField(password, /^[a-zA-Z0-9!@#$%^&*]{6,16}$/, 'password-error');

  const handleClear = () => {
    setUserName('');
    setAge('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setSubject(new Map());
    setFile(null);
    setSelectedValue('');
    setGender('');
    if (genderInputRef.current) {
      genderInputRef.current.value = '';
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const storeData = (e) => {
    e.preventDefault();
    if (
      validateUserName(userName) &&
      validateEmail(email) &&
      validateAge(age) &&
      validatePassword(password) &&
      comparePassword(password, confirmPassword) &&
      validateRequiredFields()
    ) {
      const userData = {
        username: userName,
        email,
        gender,
        age,
        stream: selectedValue,
        file,
        subject: [...subject],
      };
      const user = JSON.parse(localStorage.getItem('data')) || [];
      user.push(userData);
      localStorage.setItem('data', JSON.stringify(user));
      handleClear();
      navigate('/display');
    }
  };

  return (
    <>
      <form className='form-controller' onSubmit={storeData}>
        <div>
          Username:
          <input type='text' value={userName} onChange={(e) => setUserName(e.target.value)} placeholder='Enter Username' minLength={6} maxLength={20} />
          <span id='username-error' style={{ display: 'none', color: 'red' }}>Enter valid username</span>
        </div><br />
        <div>
          Select Gender:
          <select ref={genderInputRef} onChange={(e) => handleGenderChange(e.target.value)}>
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <span id='gender-error' style={{ display: 'none', color: 'red' }}>Select your gender</span>
        </div><br />
        <div>
          Age:
          <input type='text' value={age} onChange={(e) => setAge(e.target.value)} />
          <span id='age-error' style={{ display: 'none', color: 'red' }}>Age must be greater than 16 and less than 90</span>
        </div><br />
        <div>
          Email:
          <input type='text' value={email} onChange={(e) => setEmail(e.target.value)} />
          <span id='email-error' style={{ display: 'none', color: 'red' }}>Enter valid Email</span>
        </div><br />
        <div>
          Stream:
          <input type='radio' checked={selectedValue === 'PCM'} onChange={() => handleRadioChange('PCM')} />PCM
          <input type='radio' checked={selectedValue === 'Commerce'} onChange={() => handleRadioChange('Commerce')} />Commerce
          <input type='radio' checked={selectedValue === 'Arts'} onChange={() => handleRadioChange('Arts')} />Arts
          <span id='stream-error' style={{ display: 'none', color: 'red' }}>Select a stream</span>
        </div><br />
        <div>
          Subject:
          {checkOption.map((it) => (
            <label key={it.key}>
              {it.label}
              <input type='checkbox' name={it.name} checked={subject.includes(it.name)} onChange={handleSubjectChange} />
            </label>
          ))}
          <span id='subject-error' style={{ display: 'none', color: 'red' }}>Select at least one subject</span>
        </div>
        <div>Password:
          <input type='text' value={password} onChange={handlePasswordChange} onInput={validatePassword} />
          <span id='password-error' style={{ display: "none", color: 'red' }}>Enter valid password</span>
        </div>
        <div>Confirm Password:
          <input type='text' value={confirmPassword} onChange={handleConfirmPasswordChange} onInput={comparePassword} />
          <span id='cPassword-error' style={{ display: "none", color: 'red' }}>password and confirm password not matched</span>
        </div>
        <div>Profile Photo:
          <input type='file' ref={fileInputRef} onChange={handleProfilePic} />
        </div>
        <button>Submit</button>
      </form>
      <div>
      </div>
    </>
  )
}

export default Form

                                                                                                                                                  
const handleChangeCheck = (e) => {
    const { name, value, type, checked } = e.target;
    console.log("Name:", name);
    console.log("Value:", value);
    console.log("Type:", type);
    console.log("Checked:", checked);

    if (type === "checkbox") {
        let check = '';

        if (Array.isArray(userData[editInd].subject)) {
            for (let i = 0; i < userData[editInd].subject.length; i++) {
                if (Array.isArray(userData[editInd].subject[i])) {
                    console.log(i, "-----------", userData[editInd].subject[i][0]);
                    check = userData[editInd].subject[i][0];
                    console.log("Check:", check);
                }
            }
        }

        setEditData((prevData) => ({
            ...prevData,
            subject: checked
                ? [...(prevData.subject || []), value]
                : (prevData.subject || []).filter((sub) => sub !== value && sub !== check),
        }));

        setTimeout(() => {
            console.log("Updated Edit Data:", editData.subject);
        }, 100); // Slight delay to ensure state update before logging
    } else {
        setEditData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }
};

