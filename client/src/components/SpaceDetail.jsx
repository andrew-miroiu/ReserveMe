import { useState, useEffect } from 'react'
import './SpaceDetail.css'

function SpaceDetail({ space, onBack, user }) {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [bookedSlots, setBookedSlots] = useState([]) // ← aici ținem orele ocupate

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

  // Fetch booked slots when selectedDate changes
  useEffect(() => {
    if (!selectedDate) {
      setBookedSlots([])
      return
    }

    const fetchBookedSlots = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/reservations/by-date?spaceId=${space.id}&date=${selectedDate}`
        )
        if (!response.ok) throw new Error('Failed to fetch reservations')
        const reservations = await response.json()
        // Convert reservations to array of booked hours
        const hours = reservations.map(r => {
          const startHour = new Date(r.startTime).getUTCHours()
          const endHour = new Date(r.endTime).getUTCHours()
          const range = []
          for (let h = startHour; h < endHour; h++) range.push(h)
          return range
        }).flat()
        setBookedSlots(hours)
      } catch (err) {
        console.error('Error fetching reservations:', err)
        setError('Failed to load booked slots')
      }
    }

    fetchBookedSlots()
    setSelectedTimeSlot(null) // Reset selected slot when date changes
  }, [selectedDate, space.id])

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

      const [year, month, day] = selectedDate.split('-').map(Number)

      const startDateTime = new Date(Date.UTC(
        year,
        month - 1,
        day,
        selectedTimeSlot,
        0,
        0
      ))

      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000)

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
          startTime,
          endTime,
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
      // Refresh booked slots to reflect new reservation
      setBookedSlots(prev => [...prev, selectedTimeSlot])
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
                onChange={(e) => setSelectedDate(e.target.value)}
                min={today}
                required
              />
            </div>
          </div>

          {selectedDate && (
            <div className="time-selection">
              <label>Select Time Slot *</label>
              <div className="time-slots-grid">
                {timeSlots.map((slot) => {
                  const isBooked = bookedSlots.includes(slot.value)
                  return (
                    <button
                      key={slot.value}
                      type="button"
                      className={`time-slot-button ${selectedTimeSlot === slot.value ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
                      onClick={() => setSelectedTimeSlot(slot.value)}
                      disabled={isBooked || loading}
                      style={{
                        backgroundColor: isBooked ? '#ccc' : (selectedTimeSlot === slot.value ? '#4caf50' : '#fff'),
                        cursor: isBooked ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {slot.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">{error}</div>
          )}

          {success && (
            <div className="success-message">
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
