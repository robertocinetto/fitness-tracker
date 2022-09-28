import { useState, useEffect } from 'react'
import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'

import { collection, addDoc, getDocs, onSnapshot, doc, Timestamp } from 'firebase/firestore'
import { db } from '../firebase'

import { useRecoilState } from 'recoil'
import { userState } from '../atom/userAtom'

export const BodyCompositionForm = () => {
  const [currentUser, setCurrentUser] = useRecoilState(userState)
  const [recordDate, setRecordDate] = useState()
  const [weight, setWeight] = useState()
  const [bmi, setBMI] = useState()
  const [fatPercentage, setFatPercentage] = useState()
  const [waterPercentage, setWaterPercentage] = useState()

  async function submitFormData() {
    try {
      await addDoc(collection(db, 'records'), {
        recordDate: recordDate,
        weight: weight,
        bmi: bmi,
        fatPercentage: fatPercentage,
        waterPercentage: waterPercentage,
        username: currentUser.username,
      })

      setRecordDate(null)
      setWeight(null)
      setBMI(null)
      setFatPercentage(null)
      setWaterPercentage(null)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      {currentUser ? (
        <div className="flex gap-2">
          <div className="p-float-label w-full md:w-1/5">
            <Calendar
              className="w-full"
              id="recordDate"
              value={recordDate}
              onChange={e => setRecordDate(e.value.toLocaleDateString('it-IT'))}
              dateFormat="dd/mm/yy"
              touchUI
            />

            <label htmlFor="date">Date (gg/mm/yyyy)</label>
          </div>
          <div className="p-float-label w-full md:w-1/5">
            <InputNumber
              className="w-full"
              id="weight"
              minFractionDigits={1}
              maxFractionDigits={1}
              suffix=" kg"
              value={weight}
              onChange={e => setWeight(e.value)}
            />
            <label htmlFor="weight">Weight (kg)</label>
          </div>
          <div className="p-float-label w-full md:w-1/5">
            <InputNumber
              className="w-full"
              id="bmi"
              minFractionDigits={1}
              maxFractionDigits={1}
              value={bmi}
              onChange={e => setBMI(e.value)}
            />
            <label htmlFor="bmi">BMI</label>
          </div>

          <div className="p-float-label  w-full md:w-1/5">
            <InputNumber
              className="w-full"
              id="fats_percentage"
              minFractionDigits={1}
              maxFractionDigits={1}
              suffix=" %"
              value={fatPercentage}
              onChange={e => setFatPercentage(e.value)}
            />
            <label htmlFor="fats_percentage">Fats %</label>
          </div>

          <div className="p-float-label  w-full md:w-1/5">
            <InputNumber
              className="w-full"
              id="water_percentage"
              minFractionDigits={1}
              maxFractionDigits={1}
              suffix=" %"
              value={waterPercentage}
              onChange={e => setWaterPercentage(e.value)}
            />
            <label htmlFor="water_percentage">Water %</label>
          </div>
          <div className="">
            <Button
              label="Save"
              onClick={submitFormData}
            />
          </div>
        </div>
      ) : (
        <div>Please, sign in or sign up in to insert data</div>
      )}
    </>
  )
}
