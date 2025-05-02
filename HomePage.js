import React, { useEffect, useRef, useState } from 'react'
import Tesseract from "tesseract.js";
import uploadIcon from '../image/upload.png'
import clearIcon from '../image/clear.png'
import Webcam from "react-webcam";
import { chain, difference } from 'lodash';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const inv1 = ['lil', 'reds', 'takeout', 'and', 'c', 'oxtail', 'gravy', 'subtotal', 'taxes', 'tip', 'discount', 'total']
const inv2 = ['order', 'sandwich', 'shop', 'tip', 'total', 'your', 'delivery', 'by', 'view', 'store', 'opens', 'at']
const inv3 = ['coastline', 'burgers', 'redmond', 'street', '98052', 'ordered', 'subtotal']
const inv4 = ['greek', 'and', 'american', 'colby', 'everett', '98201', 'ordered', 'how', 'was', 'your', 'visit', 'restaurant', 'reach', 'contact']
const inv5 = ['bao', 'boss', 'order', 'details', 'subtotal', 'estimated', 'tax', 'discount', 'total']
const inv6 = ['buffalo', 'wild', 'wings', 'grill', 'bar', '1450', 'ala', 'moana', 'blvd', 'unit', '3326', 'table', 'guests', 'order', 'type', 'subtotal', 'tax', 'total', 'balance', 'due']

const HomePage = () => {
  const navigate = useNavigate()
  const webcamRef = useRef(null);
  // const inputRef = useRef(null);
  // const [hasImage, setHasImage] = useState(false)
  const [message, setMessage] = useState("");
  const [imgData, setImgData] = useState([])
  const [isCapture, setIsCapture] = useState(false)
  const [imgArr, setImgArr] = useState([])

  // const handleFile = () => {
  //   if (inputRef?.current) {
  //     inputRef.current.click();
  //   }
  // }

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isCapture) {
        captureImage();
      }
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [isCapture])

  // const handleClear = () => {
  //   setHasImage(false);
  //   setMessage("");
  // };

  const PostImage = async (img, txt) => {
    try {
      console.log('img ', img);
      const formData = new FormData();
      formData.append("tempImage", img)
      const apiResponse = await axios.post(`https://n-again.com/api/uploadImageArr`, formData);
      console.log('apiResponse ', apiResponse);
      if (apiResponse.data.status) {
        console.log("URL ", 'https://n-again.com/images/' + apiResponse.data.path);
        setImgData((prev) => [...prev, { image: img, text: txt, path: 'https://n-again.com/images/' + apiResponse.data.path }])
        return apiResponse.data.path
      }
      else {
        console.error(apiResponse?.data?.message)
      }
    }
    catch (err) {
      console.error(err?.message);
    }
  }

  const uploadBase64 = async (imageUrl, txt) => {
    try {
      const response = await axios.post(`https://n-again.com/api/uploadbase64`, { image: imageUrl })
      if (response.status) {
        console.log('response ', response);
        setImgData((prev) => [...prev, { image: imageUrl, text: txt, path: 'https://n-again.com/images/' + response?.data?.data }])
        setMessage("Image set uploadBase64")
        navigate('/text-home')
      }
    }
    catch (err) {
      console.error(err?.message);
    }
  }

  // const handleFileChange = (e) => {
  //   const newFile = e.target.files[0];
  //   console.log("new ", newFile);
  //   const files = Array.from(e.target.files)
  //   console.log("Files ", files)
  //   files.forEach(file => { recognizeText(file) })
  //   setHasImage(true);
  // }


  const captureImage = () => {
    if(isCapture) return
    console.log("pic clicked...");
    const imageUrl = webcamRef.current.getScreenshot();
    if (imageUrl) {
      // setHasImage(true)
      recognizeText(imageUrl)
    }
  }

  const isBase64 = (str) => {
    try {
      if (str === '' || str.trim() === '') {
        return false;
      }
      return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(str);
    } catch (err) {
      return false;
    }
  };

  const recognizeText = async (imageFile) => {
    setIsCapture(true)
    setMessage("Identifying text...")
    const response = await Tesseract.recognize(imageFile, "eng")
    const { data } = response;
    if (data?.text) {
      const text = chain(data?.text)
        .replace(/(\r\n|\n|\r)/gm, " ")
        .replace(/,/g, "")
        .replace(/\./g, "")
        .trim()
        .lowerCase()
        .value();
      const words = chain(text)
        .split(" ")
        .map((item) => {
          if (item) {
            return item;
          }
        })
        .value();
      if (difference(inv1, words)?.length === 0 || difference(inv2, words)?.length === 0 || difference(inv3, words)?.length === 0 || difference(inv4, words)?.length === 0 || difference(inv5, words)?.length === 0 || difference(inv6, words)?.length === 0) {
          if (typeof imageFile === 'string') {
            if(!isCapture){
              uploadBase64(imageFile, data.text)
            }
            setMessage(`Text Identified Successfully uploadBase64`)
          }
          else {
            PostImage(imageFile, data.text)
            setMessage(`Text Identified Successfully PostImage`)
          }
      } else {
        setMessage("Could not find required text in the image.");
        setIsCapture(false)
      }
    } else {
      setMessage("Could not find any text in image.");
      setIsCapture(false)
    }
  }

  return (
    <>
      {/* <div className='image-container' style={{ border: '2px solid black', width: '154px', marginLeft: '45%', marginTop: '100px' }}>
        {!hasImage ? (<div className='upload-container' onClick={handleFile}>
          <input style={{ display: 'none' }} ref={inputRef} type='file' accept='image/*' onChange={handleFileChange} />
          <img className='upload-icon' src={uploadIcon} />
          <div>Select Image</div>
        </div>
        ) : (
          <div className=''  >
            <img className='close-icon' src={clearIcon} onClick={handleClear} />
          </div>
        )}
      </div> */}
      <div style={{ position: 'fixed', left: '0', top: '0', width: '100vw', height: '100vh', backgroundColor: '#000', zIndex: 9999}}>
        <Webcam 
          ref={webcamRef}
          audio={false}
          height={100 + '%'}
          width={100 + '%'}
          // screenshotFormat="image/jpeg"
          screenshotQuality={1}
          forceScreenshotSourceSize={true}
          videoConstraints={{
            height: 720,
            width: 1280, facingMode: 'environment'
          }}
          onUserMedia={() => console.log("camera started")}
          onUserMediaError={(e) => console.warn("camera error: ", e)}
          style={{
            border: '1px solid black',
            objectFit: 'cover'
          }}
        />
      </div>

      {/* <div className="message" style={{ marginLeft: '45%', marginTop: '10px' }}>{message}</div>
      {imgData.length > 0 && imgData.map((it, i) =>
        <div key={i}>
          <h5 style={{ marginLeft: '16%', marginTop: '20px' }}>Processed Data</h5>
          <img src={typeof it.image === 'string' ? it.image : URL.createObjectURL(it.image)} style={{ marginLeft: '10%', width: '250px', height: '250px' }} />
          <p style={{ marginLeft: '10%', marginTop: '20px', fontSize: '20px' }}>Image URL: <a href={it.path} target="_blank">{it.path}</a></p>
          <pre style={{ marginLeft: '10%', marginTop: '20px', fontSize: '20px' }}>{it.text}</pre>
        </div>
      )} */}
    </>
  )
}

export default HomePage
































// 10: 30 - 11: 40 ===> project setup

// 11:40 -  1: 30 ===> correction is extractText file (run build)

// 1: 50 -- 3: 40 ===> remove button and valid word array and add time interval of 10 second  from logic error after deploy

// 3: 40 --   ==> webca, not show after deply issue



// https://grand-lamington-255712.netlify.app/
