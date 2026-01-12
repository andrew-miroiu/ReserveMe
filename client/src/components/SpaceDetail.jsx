import { useState } from 'react'
import './SpaceDetail.css'

function SpaceDetail({ space, onBack, user }) {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Generate time slots from 8 AM to 10 PM (22:00)
  const timeSlots = []
  for (let hour = 8; hour <= 22; hour++) {
    const timeLabel = hour <= 12 
      ? `${hour}:00 ${hour === 12 ? 'PM' : 'AM'}` 
      : `${hour - 12}:00 PM`
    timeSlots.push({
      value: hour,
      label: timeLabel
    })
  }

  const handleReserve = async () => {
    if (!selectedDate) {
      alert('Please select a date')
      return
    }
    if (!selectedTimeSlot) {
      alert('Please select a time slot')
      return
    }
    if (!user?.id) {
      alert('User not authenticated')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(false)

      // Construct startTime and endTime from selected date and time slot
      // Time slot is the hour (8-22), so endTime is startTime + 1 hour
      const [year, month, day] = selectedDate.split('-').map(Number)

      const startDateTime = new Date(Date.UTC(
        year,
        month - 1,           // lunile sunt 0-based
        day,
        selectedTimeSlot,    // ORA EXACTĂ pe care o apeși
        0,
        0
      ))

      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000)


      // Format as ISO 8601 strings
      const startTime = startDateTime.toISOString()
      const endTime = endDateTime.toISOString()

      const response = await fetch('http://localhost:8080/api/reservations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          spaceId: space.id,
          startTime: startTime,
          endTime: endTime,
          notes: null
        })
      })

      if (!response.ok) {
        let errorMessage = 'Failed to create reservation'
        try {
          const errorData = await response.json()
          errorMessage = typeof errorData === 'string' ? errorData : (errorData.error || errorData.message || errorMessage)
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      setSuccess(true)
      // Reset form after successful reservation
      setTimeout(() => {
        setSelectedDate('')
        setSelectedTimeSlot(null)
        setSuccess(false)
        onBack()
      }, 2000)
    } catch (err) {
      setError(err.message)
      console.error('Error creating reservation:', err)
    } finally {
      setLoading(false)
    }
  }

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-detail-container">
      <button onClick={onBack} className="back-button">← Back to business</button>
      
      <div className="space-detail-card">
        <div className="space-detail-header">
          <h1>{space.name}</h1>
          <span className={`availability-badge ${space.available ? 'available' : 'unavailable'}`}>
            {space.available ? 'Available' : 'Unavailable'}
          </span>
        </div>

        <div className="space-detail-info">
          <div className="info-item">
            <span className="info-label">Type:</span>
            <span className="info-value">{space.type}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Capacity:</span>
            <span className="info-value">{space.capacity} people</span>
          </div>
          <div className="info-item">
            <span className="info-label">Location:</span>
            <span className="info-value">{space.location}</span>
          </div>
          {space.equipment && (
            <div className="info-item">
              <span className="info-label">Equipment:</span>
              <span className="info-value">{space.equipment}</span>
            </div>
          )}
        </div>

        <div className="reservation-section">
          <h2>Make a Reservation</h2>
          
          <div className="date-selection">
            <label htmlFor="reservation-date">Select Date *</label>
            <div className="date-selection-wrapper">
              <input
                type="date"
                id="reservation-date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value)
                  setSelectedTimeSlot(null) // Reset time slot when date changes
                }}
                min={today}
                required
              />
            </div>
          </div>

          {selectedDate && (
            <div className="time-selection">
              <label>Select Time Slot *</label>
              <div className="time-slots-grid">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.value}
                    type="button"
                    className={`time-slot-button ${selectedTimeSlot === slot.value ? 'selected' : ''}`}
                    onClick={() => {setSelectedTimeSlot(slot.value)
                      console.log(selectedTimeSlot)
                    }}
                    disabled={loading}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="error-message" style={{ color: '#e74c3c', marginTop: '1rem', padding: '0.5rem', backgroundColor: '#fee', borderRadius: '4px' }}>
              {error}
            </div>
          )}

          {success && (
            <div className="success-message" style={{ color: '#27ae60', marginTop: '1rem', padding: '0.5rem', backgroundColor: '#dfe', borderRadius: '4px' }}>
              Reservation created successfully! Redirecting...
            </div>
          )}

          <button 
            type="button"
            className="reserve-button"
            onClick={handleReserve}
            disabled={!selectedDate || !selectedTimeSlot || loading}
          >
            {loading ? 'Creating Reservation...' : 'Reserve'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SpaceDetail
