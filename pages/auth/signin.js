import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useRouter } from 'next/router'

export default function Signin() {
  const router = useRouter()

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
      router.push('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <div className="flex justify-center space-x-7 mt-20">
        <div className="">
          <div className="flex flex-col items-center">
            <p className="text-sm italic my-10 text-center">This app is created for learning purposes</p>
            <button
              onClick={onGoogleClick}
              className="bg-red-400 rounded-lg p-3 text-white hover:bg-red-500"
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
