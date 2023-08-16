<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Facility;
use App\Models\Address;
use Illuminate\Http\Response;


class HomeController extends Controller
{
    public function store(Request $request)
    {
        // Data validation
        $validated = $request->validate([
            // User details input validation
            'Firstname' => 'required|string|max:50',
            'MiddleInit' => 'required|string|max:1',
            'Lastname' => 'required|string|max:50',
            'Gender' => 'required|string|max:6',
            'Age' => 'required|integer',
            'AgeUnits' => 'required|string|max:9',
            'DOB' => 'required|date|before:today',
            'Race' => 'required|string|max:50',
            'OtherDescription' => 'nullable|string|max:100',
            'Hispanic' => 'required|string|max:7',
            // Facility inputs validation
            'FacilityName' => 'nullable|string|max:100',
            'FacilityCity' => 'nullable|string|max:100',
            'FacilityCounty' => 'nullable|string|max:100',
            'FacilityTelNo' => 'nullable|string|max:12',
            'FacilityState' => 'nullable|string|max:100',
            'FacilityMedicalRec' => 'nullable|string|max:30',
            // Address inputs validation
            'AddressName' => 'nullable|string|max:100',
            'AddressStreet' => 'required|string|max:100',
            'AddressCity' => 'required|string|max:100',
            'AddressCounty' => 'required|string|max:100',
            'AddressState' => 'required|string|max:100',
        ]);

        // Creation of new user record
        $User = new User;
        $User->Firstname = $validated['Firstname'];
        $User->MiddleInit = $validated['MiddleInit'];
        $User->Lastname = $validated['Lastname'];
        $User->Gender = $validated['Gender'];
        $User->Age = $validated['Age'];
        $User->AgeUnits = $validated['AgeUnits'];
        $User->DOB = $validated['DOB'];
        $User->Race = $validated['Race'];
        $User->OtherDescription = $validated['OtherDescription'];
        $User->Hispanic = $validated['Hispanic'];

        $User->save();

        // Creation of new facility record
        $facility = new Facility;
        $facility->user_id_fk = $User->id;
        $facility->FacilityName = $validated['FacilityName'];
        $facility->FacilityCity  = $validated['FacilityCity'];
        $facility->FacilityCounty = $validated['FacilityCounty'];
        $facility->FacilityState = $validated['FacilityState'];
        $facility->FacilityTelNo = $validated['FacilityTelNo'];
        $facility->FacilityMedicalRec = $validated['FacilityMedicalRec'];

        $facility->save();

        // Creation of new address record
        $address = new Address;
        $address->user_id_fk = $User->id;
        $address->AddressName = $validated['AddressName'];
        $address->AddressStreet = $validated['AddressStreet'];
        $address->AddressCity  = $validated['AddressCity'];
        $address->AddressCounty = $validated['AddressCounty'];
        $address->AddressState = $validated['AddressState'];

        $address->save();

        // Variables will be used to retrieve IDs from database to React frontend
        return response()->json([
            'userID' => $User->id,
            'facilityID' => $facility->id,
            'addressID' => $address->id
        ]);
    }

    
    public function update(Request $request, $userId, $facilityId, $addressId)
    {
        // Retrievs ID for record to be updated
        $userInfo = User::findOrfail($userId);
        $facilityInfo = Facility::findOrfail($facilityId);
        $addressInfo = Address::findOrfail($addressId);

        // If ID doesn't exist, return error 
        if ($userInfo->update($request->all()) === false || $facilityInfo->update($request->all()) === false || $addressInfo->update($request->all()) === false) {
            return response('Error, user does not exist', Response::HTTP_BAD_REQUEST);
        }
    }
}

