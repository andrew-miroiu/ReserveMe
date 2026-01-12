import { useState, useEffect } from 'react'
import './App.css'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Rooms from './pages/Rooms'
import { supabase } from './lib/supabase'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        setIsLoggedIn(true)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        setIsLoggedIn(true)
      } else {
        setUser(null)
        setIsLoggedIn(false)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsLoggedIn(false)
    setUser(null)
  }

  if (loading) {
    return (
      <div className="App">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  if (!isLoggedIn) {
    if (showSignUp) {
      return <SignUp onSwitchToLogin={() => setShowSignUp(false)} />
    }
    return <Login onSwitchToSignUp={() => setShowSignUp(true)} />
  }

  return <Rooms user={user} onLogout={handleLogout} />
}

export default App