import { useState, useRef, useEffect } from 'react'
import { InputNumber } from 'primereact/inputnumber'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar'
import { Toast } from 'primereact/toast'
import { FileUpload } from 'primereact/fileupload'
import { InputText } from 'primereact/inputtext'
import { Image } from 'primereact/image'

import { collection, addDoc, Timestamp, updateDoc, doc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import { db, storage } from '../firebase'

import { useRecoilState } from 'recoil'
import { userState } from '../atom/userAtom'

const Profile = () => {
  const [currentUser, setCurrentUser] = useRecoilState(userState)
  const toast = useRef(null)
  const [fullName, setFullName] = useState()
  const [birthDate, setBirthDate] = useState()
  const [height, setHeight] = useState()

  useEffect(() => {
    console.log('%cProfile rendered', 'color:orange')
    setFullName(currentUser?.name)
    setBirthDate(currentUser?.birthDate.toDate())
    setHeight(currentUser?.height)
  }, [currentUser])

  const showSuccess = () => {
    toast.current.show({ severity: 'success', summary: 'Sucess!', detail: 'File uploaded', life: 3000 })
  }

  const uploadProfileImage = async e => {
    const reader = new FileReader()
    let blob = await fetch(e.files[0].objectURL).then(r => r.blob()) //blob:url
    reader.readAsDataURL(blob)
    reader.onloadend = async function () {
      const base64data = reader.result
      const imageRef = ref(storage, `users/${currentUser.uid}/image`)
      await uploadString(imageRef, base64data, 'data_url').then(async snapshot => {
        const downloadURL = await getDownloadURL(imageRef)
        await updateDoc(doc(db, 'users', currentUser.uid), {
          customProfileImg: downloadURL,
        }).then(showSuccess())
      })
    }
  }

  const submitFormData = async e => {
    e.preventDefault()
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        birthDate,
        height,
        name: fullName,
      }).then(showSuccess())
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div>
      {currentUser ? (
        <>
          <Toast ref={toast} />

          <div className="flex flex-wrap md:flex-nowrap gap-10 justify-center my-10">
            <div className="w-full">
              <FileUpload
                name="profile[]"
                accept="image/*"
                maxFileSize={1000000}
                customUpload
                uploadHandler={uploadProfileImage}
                emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
              />
            </div>

            <form
              onSubmit={submitFormData}
              className="w-full"
            >
              <div className="flex gap-2 flex-wrap p-fluid">
                <div className="w-full ">
                  <div className="rounded-full overflow-hidden inline-block">
                    <Image
                      className=""
                      src={currentUser.customProfileImg ? currentUser.customProfileImg : currentUser.userImg}
                      alt="Image"
                      width="250"
                      preview
                    />
                  </div>
                </div>
                <div className="p-float-label w-full mt-5">
                  <InputText
                    id="fullName"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                  />
                  <label htmlFor="fullName">Full name</label>
                </div>
                <div className="p-float-label w-full mt-5">
                  <Calendar
                    className="w-full"
                    id="birthDate"
                    value={birthDate}
                    onChange={e => setBirthDate(Timestamp.fromDate(e.value))}
                    dateFormat="dd/mm/yy"
                    touchUI
                    required
                    readOnlyInput
                  />

                  <label htmlFor="date">Birthdate (gg/mm/yyyy)</label>
                </div>
                <div className="p-float-label w-full mt-5">
                  <InputNumber
                    className="w-full"
                    id="height"
                    suffix=" cm"
                    value={height}
                    onChange={e => setHeight(e.value)}
                    required
                  />
                  <label htmlFor="height">Height (cm)</label>
                </div>
                <div className="w-full mt-5">
                  <Button
                    type="submit"
                    label="Submit"
                  />
                </div>
              </div>
            </form>
          </div>
        </>
      ) : (
        <div>Please, sign in or sign up in to insert data</div>
      )}
    </div>
  )
}

export default Profile
