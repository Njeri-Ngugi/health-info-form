import Biodata from "./views/Biodata"
import Success from "./views/Success";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from "react";
import React from "react";

function App() {

  const [userID, setUserID] = useState(null)
  const [facilityID, setFacilityID] = useState(null)
  const [addressID, setAddressID] = useState(null)

  return (
    <>
      <BrowserRouter>
        <div className='App'>

          <Routes>
            <Route exact path='/' element={<Biodata userID={userID} setUserID={setUserID} facilityID={facilityID} setFacilityID={setFacilityID} addressID={addressID} setAddressID={setAddressID} />} />
            <Route path='/thank-you' element={<Success />} />

          </Routes>

        </div>
      </BrowserRouter>
    </>
  )
}

export default App
