import { useState, useRef } from 'react'
import { InputNumber } from 'primereact/inputnumber'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Toast } from 'primereact/toast'

import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '../firebase'

import { useRecoilState } from 'recoil'
import { userState } from '../atom/userAtom'

const BodyCompositionForm = () => {
  const [currentUser] = useRecoilState(userState)
  const [recordDate, setRecordDate] = useState()
  const [weight, setWeight] = useState()
  const [bmi, setBMI] = useState()
  const [fatPercentage, setFatPercentage] = useState()
  const [waterPercentage, setWaterPercentage] = useState()
  const toast = useRef(null)

  async function submitFormData(e) {
    e.preventDefault()
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
      showSuccess()
    } catch (e) {
      console.log(e)
    }
  }

  const showSuccess = () => {
    toast.current.show({ severity: 'success', summary: 'Confirmed!', detail: 'Your new entry has been added successfully', life: 3000 })
  }

  return (
    <>
      {currentUser ? (
        <form onSubmit={submitFormData}>
          <Toast ref={toast} />
          <div className="flex gap-2 flex-wrap md:flex-nowrap p-fluid">
            <div className="p-float-label w-full md:w-1/5">
              <Calendar
                className="w-full"
                id="recordDate"
                value={recordDate}
                onChange={e => setRecordDate(Timestamp.fromDate(e.value))}
                dateFormat="dd/mm/yy"
                touchUI
                required
                readOnlyInput
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
                required
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
                required
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
                required
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
                required
              />
              <label htmlFor="water_percentage">Water %</label>
            </div>
            <div className="w-full md:w-1/5">
              <Button
                type="submit"
                label="Submit"
              />
            </div>
          </div>
        </form>
      ) : (
        <div>Please, sign in or sign up in to insert data</div>
      )}
    </>
  )
}

export default BodyCompositionForm
