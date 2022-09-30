import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

import Image from 'next/image'
import { ProgressBar } from 'primereact/progressbar'
import { DarkModeSwitch } from 'react-toggle-dark-mode'
import { Menu } from 'primereact/menu'
import { Button } from 'primereact/button'

import { userState } from '../atom/userAtom'
import { useRecoilState } from 'recoil'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

import { useTheme } from 'next-themes'

export default function Header() {
  const [currentUser, setCurrentUser] = useRecoilState(userState)
  const router = useRouter()
  const auth = getAuth()

  const { resolvedTheme, theme, setTheme } = useTheme()
  const [switchState, setSwitchState] = useState()

  const menu = useRef(null)

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

    if (localStorage.theme === 'dark' || resolvedTheme === 'dark') {
      setSwitchState(true)
    } else if (localStorage.theme === 'light' || resolvedTheme === 'light') {
      setSwitchState(false)
    }
  }, [resolvedTheme])

  const toggleTheme = checked => {
    console.log(checked)
    if (checked) {
      setSwitchState(true)
      setTheme('dark')
    } else {
      setSwitchState(false)
      setTheme('light')
    }
  }

  const resetDarkMode = () => {
    setTheme('system')
  }

  const onSignOut = () => {
    signOut(auth)
    setCurrentUser(null)
    router.reload()
  }

  const items = [
    {
      label: 'Options',
      items: [
        {
          label: 'Reset dark mode',
          icon: 'pi pi-refresh',
          command: () => {
            resetDarkMode()
          },
        },
        {
          label: 'Log out',
          icon: 'pi pi-power-off',
          command: () => {
            onSignOut()
          },
        },
      ],
    },
    // {
    //   label: 'Navigate',
    //   items: [
    //     {
    //       label: 'React Website',
    //       icon: 'pi pi-external-link',
    //       url: 'https://reactjs.org/',
    //     },
    //     {
    //       label: 'Router',
    //       icon: 'pi pi-upload',
    //       command: e => {
    //         window.location.hash = '/fileupload'
    //       },
    //     },
    //   ],
    // },
  ]

  return (
    <div className="max-w-7xl xl:mx-auto px-5">
      <div className="flex items-center justify-between ">
        {/* Left */}
        <div className="cursor-pointer h-24 w-52 relative ">
          <Image
            src={`${resolvedTheme === 'dark' ? '/fitness tracker logo white.svg' : '/fitness tracker logo.svg'}`}
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
              <DarkModeSwitch
                checked={switchState}
                onChange={toggleTheme}
                size={30}
              />
              <Menu
                model={items}
                popup
                ref={menu}
                id="popup_menu"
              />
              <Button
                className="p-button-rounded p-button-text p-button-sm p-button-plain"
                aria-label="Settings"
                icon="pi pi-cog"
                onClick={event => menu.current.toggle(event)}
                aria-controls="popup_menu"
                aria-haspopup
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
