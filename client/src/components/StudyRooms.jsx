import { useState, useEffect } from 'react'
import './StudyRooms.css'
import SpaceDetail from './SpaceDetail'

function StudyRooms({ onBack, isAdmin, user }) {
  const [spaces, setSpaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedSpace, setSelectedSpace] = useState(null)

  useEffect(() => {
    fetchSpaces()
  }, [])

  const fetchSpaces = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('http://localhost:8080/api/spaces')
      
      if (!response.ok) {
        throw new Error('Failed to fetch spaces')
      }
      
      const data = await response.json()
      // Filter for study rooms (case-insensitive check)
      const studyRooms = data.filter(space => 
        space.type && space.type.toLowerCase().includes('study')
      )
      setSpaces(studyRooms)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching study rooms:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (spaceId) => {
    if (!window.confirm('Are you sure you want to delete this space? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`http://localhost:8080/api/spaces/${spaceId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete space')
      }

      // Refresh the list after deletion
      fetchSpaces()
    } catch (err) {
      alert('Error deleting space: ' + err.message)
      console.error('Error deleting space:', err)
    }
  }

  if (loading) {
    return (
      <div className="study-rooms-container">
        <button onClick={onBack} className="back-button">← Back</button>
        <div className="room-view-content">
          <div className="loading">Loading study rooms...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="study-rooms-container">
        <button onClick={onBack} className="back-button">← Back</button>
        <div className="room-view-content">
          <div className="error-message">Error: {error}</div>
        </div>
      </div>
    )
  }

  if (selectedSpace) {
    return (
      <SpaceDetail
        space={selectedSpace}
        onBack={() => setSelectedSpace(null)}
        user={user}
      />
    )
  }

  return (
    <div className="study-rooms-container">
      <button onClick={onBack} className="back-button">← Back</button>
      <div className="rooms-header-section">
        <h1>Study Rooms</h1>
        <p className="rooms-count">{spaces.length} room(s) available</p>
      </div>
      
      {spaces.length === 0 ? (
        <div className="room-view-content">
          <p className="no-rooms">No study rooms found</p>
        </div>
      ) : (
        <div className="spaces-grid">
          {spaces.map((space) => (
            <div 
              key={space.id} 
              className="space-card"
              onClick={() => setSelectedSpace(space)}
              style={{ cursor: 'pointer' }}
            >
              <div className="space-header">
                <h3>{space.name}</h3>
                <div className="header-right">
                  <span className={`availability-badge ${space.available ? 'available' : 'unavailable'}`}>
                    {space.available ? 'Available' : 'Unavailable'}
                  </span>
                  {isAdmin && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(space.id)
                      }} 
                      className="delete-button"
                      title="Delete space"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
              
              <div className="space-details">
                <div className="detail-item">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">{space.type}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Capacity:</span>
                  <span className="detail-value">{space.capacity} people</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">{space.location}</span>
                </div>
                
                {space.equipment && (
                  <div className="detail-item equipment-item">
                    <span className="detail-label">Equipment:</span>
                    <span className="detail-value">{space.equipment}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StudyRooms
