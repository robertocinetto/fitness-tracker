import { getAuth, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { db } from '../firebase'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'

import Image from 'next/image'
import { ProgressBar } from 'primereact/progressbar'
import { DarkModeSwitch } from 'react-toggle-dark-mode'
import { Menu } from 'primereact/menu'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Chip } from 'primereact/chip'

import { userState } from '../atom/userAtom'
import { useRecoilState } from 'recoil'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

import { useTheme } from 'next-themes'
import Link from 'next/link'

export default function Header() {
  const [currentUser, setCurrentUser] = useRecoilState(userState)
  const router = useRouter()
  const auth = getAuth()

  const { resolvedTheme, theme, setTheme } = useTheme()
  const [switchState, setSwitchState] = useState()

  const menu = useRef(null)

  const [popupVisible, setPopupVisible] = useState(false)

  useEffect(() => {
    console.log('%cHeader rendered', 'color:orange')
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
          label: 'Profile',
          icon: 'pi pi-user',
          command: () => {
            router.push('/profile')
          },
        },
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
  ]

  const displayPopup = () => setPopupVisible(curr => !curr)
  async function onGoogleClick() {
    try {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      const user = auth.currentUser.providerData[0]
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          userImg: user.photoURL,
          uid: user.uid,
          timestamp: serverTimestamp(),
          username: user.email,
        })
      }
      displayPopup()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="max-w-screen-2xl xl:mx-auto px-5">
      <div className="flex items-center justify-between ">
        <div className="cursor-pointer h-24 w-44 lg:w-52 relative ">
          <Link href="/">
            <a>
              <Image
                src={`${resolvedTheme === 'dark' ? '/fitness tracker logo white.svg' : '/fitness tracker logo.svg'}`}
                layout="fill"
                className="object-contain"
              />
            </a>
          </Link>
        </div>

        <div className="flex items-center">
          {currentUser ? (
            <>
              <Chip
                label={currentUser.name}
                image={currentUser.customProfileImg ? currentUser.customProfileImg : currentUser.userImg}
                className="hidden md:inline-flex"
              />
              <img
                src={currentUser.customProfileImg ? currentUser.customProfileImg : currentUser.userImg}
                alt="user-image"
                className="h-9 rounded-full cursor-pointer md:hidden"
              />
              <DarkModeSwitch
                className="ml-3"
                checked={switchState}
                onChange={toggleTheme}
                size={30}
              />
              <Button
                className="p-button-rounded p-button-text p-button-sm p-button-plain ml-2"
                aria-label="Settings"
                icon="pi pi-cog"
                onClick={event => menu.current.toggle(event)}
                aria-controls="popup_menu"
                aria-haspopup
              />
              <Menu
                model={items}
                popup
                ref={menu}
                id="popup_menu"
              />
            </>
          ) : (
            <>
              <button onClick={displayPopup}>Sign in</button>
              <Dialog
                visible={popupVisible}
                style={{ width: '400px' }}
                onHide={displayPopup}
                draggable={false}
                headerClassName="login-popup-header"
              >
                <div className="text-center">
                  <Image
                    src={`${resolvedTheme === 'dark' ? '/fitness tracker logo white.svg' : '/fitness tracker logo.svg'}`}
                    // layout="fill"
                    className=""
                    width={200}
                    height={50}
                  />
                </div>
                <h4 className="text-center">Login with</h4>
                <Button
                  className="google p-0 w-full flex justify-center mb-3"
                  aria-label="Google"
                  onClick={onGoogleClick}
                >
                  <i className="pi pi-google px-2"></i>
                  <span className="px-3">Google</span>
                </Button>
                {/* <Button
                  className="facebook p-0 w-full flex justify-center"
                  aria-label="Facebook"
                >
                  <i className="pi pi-facebook px-2"></i>
                  <span className="px-3">Facebook</span>
                </Button> */}
              </Dialog>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
