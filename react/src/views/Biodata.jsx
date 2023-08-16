import React, { useCallback, useState } from 'react';
import axiosClient from '../axios';
import { useNavigate } from 'react-router-dom';
import PersonalData from '../assets/PersonalData.css'


const Biodata = ({ userID, facilityID, addressID, setUserID, setFacilityID, setAddressID }) => {
    const navigate = useNavigate()

    // Initialize states for all form inputs
    const [formData, setFormData] = useState({
        // Personal details inputs
        Firstname: '', MiddleInit: '', Lastname: '', Gender: '', Age: 0, AgeUnits: '', DOB: '', Race: '', OtherDescription: '', Hispanic: '',
        // Facility details Inputs
        FacilityName: '', FacilityCity: '', FacilityCounty: '', FacilityState: '', FacilityTelNo: '', FacilityMedicalRec: '',
        // Address details inputs
        AddressName: '', AddressStreet: '', AddressCity: '', AddressCounty: '', AddressState: ''
    });


    // HANDLE SUBMIT FUNCTION
    const handleSubmitForm = async (event) => {
        event.preventDefault();

        // If user ID exists, then the handle update function is called to update records with the inputs that will be entered again
        if (userID !== null) {
            console.log("Current user ID is: ", userID)
            handleUpdateForm()
        }
        else {
            // Other race description must be filled if "Other" race input was checked
            if (formData.Race === 'Other' && formData.OtherDescription.trim() === '') {
                alert("Other race description is required.")
            }

            else {
                const { Firstname, MiddleInit, Lastname, Gender, Age, AgeUnits, DOB, Race, OtherDescription, Hispanic, FacilityName, FacilityCity, FacilityCounty, FacilityState, FacilityTelNo, FacilityMedicalRec } = formData;

                console.log(Firstname, MiddleInit, Lastname, Gender, Age, AgeUnits, DOB, Race, OtherDescription, Hispanic, FacilityName, FacilityCity, FacilityCounty, FacilityState, FacilityTelNo, FacilityMedicalRec);


                await axiosClient({
                    method: "POST",
                    data: formData,
                    url: `/personal-info`,
                    headers: { "X-CSRF-Token": document.querySelector("meta[name=csrf-token]").content }
                })
                    .then(response => {
                        console.log(response)
                        if (response.status === 200) {
                            // Retrieve all IDs
                            const enteredUserID = response.data.userID;
                            const enteredFacilityID = response.data.facilityID
                            const enteredAddressID = response.data.addressID

                            // Set state for retrieved IDs
                            setUserID(enteredUserID)
                            setFacilityID(enteredFacilityID)
                            setAddressID(enteredAddressID)

                            // Save the user Id to session storage. 
                            // Determines whether handle submit or handle update function is executed
                            sessionStorage.setItem('userID', enteredUserID)

                            // Display success message page
                            navigate('/thank-you', { replace: false })
                        }
                        else if (response === 500) {
                            alert("Error! Ensure all fields have been filled correctly.")
                        }
                        else {
                            alert("An error occured. Please re-enter form details")
                        }
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
        }
    }

    // HANDLE UPDATE FUNCTION
    const handleUpdateForm = useCallback(async () => {

        const currentUserID = sessionStorage.getItem('userID')

        console.log("Updating data for user id:  ", currentUserID, formData)

        await axiosClient({
            method: "PUT",
            data: formData,
            url: `/update_data/${userID}/${facilityID}/${addressID}`,
            headers: { "X-CSRF-Token": document.querySelector("meta[name=csrf-token]").content }
        })
            .then(response => {
                console.log(response)
                if (response.status === 200) {
                    navigate('/thank-you', { replace: false })
                }
                else if (response === 404) {
                    alert("User doesn't exist!")
                }
                else if (response === 500) {
                    alert("Error! Ensure all fields have been filled correctly.")
                }
                else {
                    alert("Sorry, Please refill the form.")
                }
            })
            .catch(error => {
                console.log(error)
                alert("Error updating data")
            })
    }, [navigate, formData])


    // HANDLE CHANGE FUNCTION
    const handleChangeForm = (event) => {
        // Set state for inputs 
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        })

        // Calculates age and checks correct radio buttons for AgeUnits depending on whether age is in years or months
        if (event.target.name === 'DOB') {
            // Calculation of the age
            const dob = new Date(event.target.value);
            const years_diff = Date.now() - dob.getTime();
            const years = new Date(years_diff)
            const convertedYears = years.getUTCFullYear()
            const ageInYears = Math.abs(convertedYears - 1970)
            const months_diff = years.getUTCMonth()
            const ageInMonths = ageInYears * 12 + months_diff

            // Set states for age and age units depending on age calculated
            ageInYears >= 1 ?
                setFormData({
                    ...formData,
                    [event.target.name]: event.target.value,
                    Age: ageInYears,
                    AgeUnits: 'In Years',

                })

                : setFormData({
                    ...formData,
                    [event.target.name]: event.target.value,
                    Age: ageInMonths,
                    AgeUnits: 'In Months',

                })
        }
        else {
            setFormData({
                ...formData,
                [event.target.name]: event.target.value,
            })
        }
    }

    // The biodata form:
    return (
        <>

            <form onSubmit={handleSubmitForm}>
                <div className='containerBox'>
                    <div className='banner'>
                        
                    </div>

                    <div className='content'>
                        {/* Names */}
                        <h1>Patient Identifying Information</h1>
                        <div className='names'>
                            <div className='namesLabels'>
                                <div>
                                    <label htmlFor="Firstname">Firstname<span className='star'>*</span></label>
                                </div>

                                <div>
                                    <label htmlFor="MiddleInit">Middle Initial<span className='star'>*</span></label>
                                </div>

                                <div>
                                    <label htmlFor="Lastname">Lastname<span className='star'>*</span></label>
                                </div>
                            </div>

                            <div className='namesInputs'>
                                <div>
                                    <input className='firstNameInput' type="text" name="Firstname" value={formData.Firstname} placeholder='First' onChange={handleChangeForm} required />
                                </div>

                                <div>
                                    <input className='middleInitialInput' type="text" name="MiddleInit" placeholder='Middle' value={formData.MiddleInit} onChange={handleChangeForm} required />
                                </div>

                                <div>
                                    <input className='lastNameInput' type="text" name="Lastname" value={formData.Lastname} onChange={handleChangeForm} placeholder='Last' required />
                                </div>
                            </div>
                        </div>

                        <div className='DOBs'>
                            <div className='DOBLabel'>
                                <label htmlFor="DOB">Date of Birth<span className='star'>*</span></label>
                            </div>

                            <div className='DOBsInputDiv'>
                                <input className='DOBInput' type="date" name="DOB" id='DOB' value={formData.DOB} onChange={handleChangeForm} required />
                            </div>
                        </div>

                        <div className='genders'>
                            <div className='gendersLabel'>
                                <label className='genderLabel' htmlFor="Gender">Gender<span className='star'>*</span></label>
                            </div>

                            <div className='gendersInputs'>
                                <div>
                                    <input className='genderRadios' type="radio" name="Gender" value="Male" onChange={handleChangeForm} required />
                                    <label  htmlFor="Gender">Male</label>
                                </div>

                                <div>
                                    <input className='genderRadios' type="radio" name="Gender" value="Female" onChange={handleChangeForm} required />
                                    <label htmlFor="Gender">Female</label>
                                </div>
                            </div>
                        </div>

                        {/* Form inputs for age and age units is hidden and automatically filled depending on age calculated from DOB input*/}
                        <input hidden className='ageInput' id='ageInput' type="number" name="Age" value={formData.Age} onChange={handleChangeForm} required />

                        <input hidden type="radio" name="AgeUnits" checked={formData.AgeUnits === 'In Years'} value="In Years" id='ageUnitsYears'
                            onChange={handleChangeForm} required />

                        <input hidden type="radio" id='ageUnitsMonths' name="AgeUnits" checked={formData.AgeUnits === 'In Months'}
                            value="In Months" onChange={handleChangeForm} required />

                        <div className='races'>
                            <div className='racesLabel'>
                                <label>Race<span className='star'>*</span></label>
                            </div>

                            <div className='racesInputsRow1'>
                                <div>
                                    <input className='raceRadios' type="radio" name="Race" value="Black" onChange={handleChangeForm} required />
                                    <label htmlFor="Race">Black</label>
                                </div>

                                <div>
                                    <input className='raceRadios' type="radio" name="Race" value="Asian/Pacific Islander" onChange={handleChangeForm} required />
                                    <label htmlFor="Race">Asian/Pacific Islander</label>
                                </div>
                            </div>

                            <div className='racesInputsRow2'>
                                <div>
                                    <input className='raceRadios' type="radio" name="Race" value="White" onChange={handleChangeForm} required />
                                    <label htmlFor="Race">White</label>
                                </div>

                                <div>
                                    <input className='raceRadios' type="radio" name="Race" value="Unknown" onChange={handleChangeForm} required />
                                    <label htmlFor="Race">Unknown</label>
                                </div>
                            </div>
                            <div className='racesInputsRow3'>
                                <div>
                                    <input type="radio" checked={formData.Race === 'Other'} id='Other' name="Race" value="Other" onChange={handleChangeForm} required />
                                    <label htmlFor="Race">Other</label>

                                    <span >
                                        <input type="text" placeholder='Please describe' id='OtherDescription' name="OtherDescription" value={formData.OtherDescription} onChange={handleChangeForm} />
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className='hispanics'>
                            <div className='hispanicsLabels'>
                                <label htmlFor="Hispanic">Hispanic / Latino<span className='star'>*</span></label>
                            </div>

                            <div className='hispanicsInputs'>
                                <div>
                                    <input className='hispanicRadios' type="radio" name="Hispanic" value="Yes" onChange={handleChangeForm} required />
                                    <label htmlFor="Hispanic">Yes</label>
                                </div>

                                <div>
                                    <input className='hispanicRadios' type="radio" name="Hispanic" value="No" onChange={handleChangeForm} required />
                                    <label htmlFor="Hispanic">No</label>
                                </div>

                                <div>
                                    <input className='hispanicRadios' type="radio" name="Hispanic" value="Unknown" onChange={handleChangeForm} required />
                                    <label htmlFor="Hispanic">Unknown</label>
                                </div>
                            </div>
                        </div>

                        <hr />
                        {/* **********Facility details section********* */}

                        <div className="facilitySection">
                            <div className="facility">
                                <div className="facilityLabel">
                                    <h3 className='facilityHeading'>
                                        Facility (if hospitalized)</h3>
                                    <label htmlFor='FacilityName'>Facility Name</label>
                                </div>
                                <div className="Input">
                                    <input className="facilityInput" type="text" name="FacilityName" value={formData.FacilityName} onChange={handleChangeForm} />
                                </div>
                            </div>

                            <div className="cityAndCounty">
                                <div className='city'>
                                    <div className="cityLabel">
                                        <label htmlFor='FacilityCity'>City</label>
                                    </div>
                                    <div className="Input">
                                        <input className="cityInput" type="text" name="FacilityCity" value={formData.FacilityCity} onChange={handleChangeForm} />
                                    </div>
                                </div>

                                <div className="county">
                                    <div className="countyLabel">
                                        <label htmlFor='FacilityCounty'>County</label>
                                    </div>
                                    <div className="Input">
                                        <input className="countyInput" type="text" name="FacilityCounty" value={formData.FacilityCounty} onChange={handleChangeForm} />
                                    </div>
                                </div>
                            </div>

                            <div className="stateAndTelNo">
                                <div className='state'>
                                    <div className="stateLabel">
                                        <label htmlFor='FacilityState'>State</label>
                                    </div>
                                    <div className="Input">
                                        <input className="stateInput" type="text" name="FacilityState" value={formData.FacilityState} onChange={handleChangeForm} />
                                    </div>
                                </div>

                                <div className="tel">
                                    <div className="telLabel">
                                        <label htmlFor='FacilityTelNo'>Phone Number</label>
                                    </div>
                                    <div className="Input">
                                        <input className="telInput" type="number" name="FacilityTelNo" value={formData.FacilityTelNo} onChange={handleChangeForm} />
                                    </div>
                                </div>
                            </div>

                            <div className="med">
                                <div className="medLabel">
                                    <label htmlFor='FacilityMedicalRec'>Medical Record Number:</label>
                                </div>
                                <span className="Input">
                                    <input className="medInput" type="text" name="FacilityMedicalRec" value={formData.FacilityMedicalRec} onChange={handleChangeForm} />
                                </span>
                            </div>
                        </div>

                        <hr />

                        {/* ************Address Inputs*********** */}

                        <div className='addressSection'>
                            <div className="facilityName">
                                <div className="facilityNameLabel">
                                    <h3 className='addressHeading'>
                                        CurrentAddress</h3>
                                    <label htmlFor='AddressName'>Facility Name (if applicable)</label>
                                </div>
                                <div>
                                    <input className="facilityNameInput" type="text" name="AddressName" value={formData.AddressName} onChange={handleChangeForm} />
                                </div>
                            </div>

                            <div className="streetAndCity">
                                <div className='street'>
                                    <div className="streetLabel">
                                        <label htmlFor='AddressStreet'>Street<span className='star'>*</span></label>
                                    </div>
                                    <div>
                                        <input className="streetInput" type="text" name="AddressStreet" value={formData.AddressStreet} onChange={handleChangeForm} />
                                    </div>
                                </div>

                                <div className="addressCity">
                                    <div className="addressCityLabel">
                                        <label htmlFor="AddressCity">City<span className='star'>*</span></label>
                                    </div>
                                    <div>
                                        <input className="addressCityInput" type="text" name="AddressCity" value={formData.AddressCity} onChange={handleChangeForm} />
                                    </div>
                                </div>
                            </div>



                            <div className='countyAndState'>
                                <div className="addressCounty">
                                    <div className="addressCountyLabel">
                                        <label htmlFor='AddressCounty'>County<span className='star'>*</span></label>
                                    </div>
                                    <div>
                                        <input className="addressCountyInput" type="text" name="AddressCounty" value={formData.AddressCounty} onChange={handleChangeForm} />
                                    </div>
                                </div>

                                <div className="addressState">
                                    <div className="addressStateLabel">
                                        <label htmlFor="AddressState">State<span className='star'>*</span></label>
                                    </div>
                                    <div>
                                        <input className="addressStateInput" type="text" name="AddressState" value={formData.AddressState} onChange={handleChangeForm} />
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className='submitButtonDiv' align="center">
                            <button className='submitButton' type="submit">Submit</button>
                        </div>

                    </div>
                </div>
            </form>

        </>
    )
}

export default Biodata;
