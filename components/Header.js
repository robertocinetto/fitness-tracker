import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { db } from '../firebase'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'

import Image from 'next/image'
import { SearchIcon, PlusCircleIcon } from '@heroicons/react/outline'
import { HomeIcon } from '@heroicons/react/solid'
import { InputSwitch } from 'primereact/inputswitch'

import { userState } from '../atom/userAtom'
import { themeState } from '../atom/themeAtom'
import { useRecoilState } from 'recoil'
import { useEffect, useLayoutEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { useTheme } from 'next-themes'

export default function Header() {
  const [currentUser, setCurrentUser] = useRecoilState(userState)
  const router = useRouter()
  const auth = getAuth()

  const { theme, setTheme } = useTheme()
  const [switchState, setSwitchState] = useState()

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        const fetchUser = async () => {
          const docRef = doc(db, 'users', user.auth.currentUser.providerData[0].uid)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            setCurrentUser(docSnap.data())
          }
        }
        fetchUser()
      }
    })

    if (localStorage.theme === 'dark') {
      setSwitchState(true)
    } else if (localStorage.theme === 'light') {
      setSwitchState(false)
    }
  }, [])

  const toggleTheme = e => {
    if (e.value) {
      setSwitchState(true)
      setTheme('dark')
    } else {
      setSwitchState(false)
      setTheme('light')
    }
  }

  function onSignOut() {
    signOut(auth)
    setCurrentUser(null)
    router.reload()
  }

  return (
    <div className="max-w-7xl xl:mx-auto px-5">
      <div className="flex items-center justify-between ">
        {/* Left */}
        <div className="cursor-pointer h-24 w-52 relative ">
          <Image
            src={`${theme === 'dark' ? '/fitness tracker logo white.svg' : '/fitness tracker logo.svg'}`}
            layout="fill"
            className="object-contain"
          />
        </div>

        {/* Middle */}

        {/* <div className="relative mt-1">
          <div className="absolute top-2 left-2">
            <SearchIcon className="h-5 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-50 pl-10 border-gray-500 text-sm focus:ring-black focus:border-black rounded-md"
          />
        </div> */}

        {/* Right */}

        <div className="flex space-x-4 items-center">
          {/* <HomeIcon className="hidden md:inline-flex  h-6 cursor-pointer hover:scale-125 transition-tranform duration-200 ease-out" /> */}
          {currentUser ? (
            <>
              {/* <PlusCircleIcon
                onClick={() => setOpen(true)}
                className="h-6 cursor-pointer hover:scale-125 transition-tranform duration-200 ease-out"
              /> */}
              <img
                src={currentUser.userImg}
                alt="user-image"
                className="h-10 rounded-full cursor-pointer"
                onClick={onSignOut}
              />

              <InputSwitch
                checked={switchState}
                onChange={toggleTheme}
              />
            </>
          ) : (
            <button onClick={() => router.push('/auth/signin')}>Sign in</button>
          )}
        </div>
      </div>
    </div>
  )
}
