import { useState, useEffect } from 'react'
import './Rooms.css'
import StudyRooms from '../components/StudyRooms'
import GymRooms from '../components/GymRooms'
import CreateSpaceForm from '../components/CreateSpaceForm'
import { supabase } from '../lib/supabase'

function Rooms({ user, onLogout }) {
  const [activeView, setActiveView] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const userName = user?.user_metadata?.name || user?.email || 'User'

  useEffect(() => {
    fetchUserProfile()
  }, [user])

  const fetchUserProfile = async () => {
    if (!user?.id) {
      setLoadingProfile(false)
      return
    }

    try {
      setLoadingProfile(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        setIsAdmin(false)
      } else {
        setIsAdmin(data?.is_admin || false)
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
      setIsAdmin(false)
    } finally {
      setLoadingProfile(false)
    }
  }

  const handleStudyRoomsClick = () => {
    setActiveView('study')
  }

  const handleGymRoomsClick = () => {
    setActiveView('gym')
  }

  const handleBack = () => {
    setActiveView(null)
  }

  const handleCreateSuccess = () => {
    setShowCreateForm(false)
    // Optionally refresh the spaces list or show a success message
  }

  if (activeView === 'study') {
    return <StudyRooms onBack={handleBack} isAdmin={isAdmin} user={user} />
  }

  if (activeView === 'gym') {
    return <GymRooms onBack={handleBack} isAdmin={isAdmin} user={user} />
  }

  if (showCreateForm) {
    return <CreateSpaceForm onBack={() => setShowCreateForm(false)} onSuccess={handleCreateSuccess} />
  }

  return (
    <div className="rooms-container">
      <div className="rooms-header">
        <div className="welcome-section">
          <h1>Welcome back, {userName}!</h1>
          {!loadingProfile && (
            <p className="admin-status">{isAdmin ? 'Admin' : 'Not Admin'}</p>
          )}
        </div>
        <div className="header-buttons">
          {isAdmin && (
            <button onClick={() => setShowCreateForm(true)} className="add-space-button">
              Add Space
            </button>
          )}
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
      
      <div className="rooms-content">
        <h2>Select a Room Type</h2>
        <div className="rooms-grid">
          <div className="room-card" onClick={handleStudyRoomsClick}>
            <div className="room-icon">📚</div>
            <h3>Study Rooms</h3>
            <p>View and book study rooms</p>
          </div>
          
          <div className="room-card" onClick={handleGymRoomsClick}>
            <div className="room-icon">🏋️</div>
            <h3>Gym Rooms</h3>
            <p>View and book gym rooms</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Rooms