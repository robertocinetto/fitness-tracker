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
  const [fatPercentage, setFatPercentage] = useState()
  const [waterPercentage, setWaterPercentage] = useState()
  const [musclesKg, setMusclesKg] = useState()
  const [classification, setClassification] = useState()
  const [bones, setBones] = useState()
  const [dailyKCal, setDailyKCal] = useState()
  const [age, setAge] = useState()
  const [bellyFat, setBellyFat] = useState()

  const toast = useRef(null)

  async function submitFormData(e) {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'records'), {
        recordDate,
        weight,
        musclesKg,
        fatPercentage,
        waterPercentage,
        classification,
        bones,
        dailyKCal,
        age,
        bellyFat,
        username: currentUser.username,
      })

      setRecordDate(null)
      setWeight(null)
      setFatPercentage(null)
      setWaterPercentage(null)
      setMusclesKg(null)
      setClassification(null)
      setBones(null)
      setDailyKCal(null)
      setAge(null)
      setBellyFat(null)
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
            <div className="p-float-label w-full md:w-1/5">
              <InputNumber
                className="w-full"
                id="musclesKg"
                minFractionDigits={1}
                maxFractionDigits={1}
                value={musclesKg}
                onChange={e => setMusclesKg(e.value)}
                required
              />
              <label htmlFor="musclesKg">Muscles (Kg)</label>
            </div>
          </div>
          {/* second row */}
          <div className="flex gap-2 flex-wrap md:flex-nowrap p-fluid mt-2">
            <div className="p-float-label w-full md:w-1/5">
              <InputNumber
                className="w-full"
                id="classification"
                minFractionDigits={0}
                maxFractionDigits={0}
                value={classification}
                onChange={e => setClassification(e.value)}
                required
              />
              <label htmlFor="classification">CLASS</label>
            </div>
            <div className="p-float-label w-full md:w-1/5">
              <InputNumber
                className="w-full"
                id="bones"
                minFractionDigits={1}
                maxFractionDigits={1}
                suffix=" kg"
                value={bones}
                onChange={e => setBones(e.value)}
                required
              />
              <label htmlFor="bones">Bones (kg)</label>
            </div>
            <div className="p-float-label w-full md:w-1/5">
              <InputNumber
                className="w-full"
                id="dailyKCal"
                minFractionDigits={0}
                maxFractionDigits={0}
                value={dailyKCal}
                onChange={e => setDailyKCal(e.value)}
                required
              />
              <label htmlFor="dailyKCal">Daily KCal</label>
            </div>

            <div className="p-float-label  w-full md:w-1/5">
              <InputNumber
                className="w-full"
                id="age"
                minFractionDigits={0}
                maxFractionDigits={0}
                value={age}
                onChange={e => setAge(e.value)}
                required
              />
              <label htmlFor="age">Age</label>
            </div>

            <div className="p-float-label  w-full md:w-1/5">
              <InputNumber
                className="w-full"
                id="bellyFat"
                minFractionDigits={1}
                maxFractionDigits={1}
                suffix=" %"
                value={bellyFat}
                onChange={e => setBellyFat(e.value)}
                required
              />
              <label htmlFor="bellyFat">Belly fat</label>
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
