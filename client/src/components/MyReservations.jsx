import { useState, useEffect } from 'react'
import './MyReservations.css'

function MyReservations({ user, onBack }) {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user?.id) {
      fetchReservations()
    } else {
      setLoading(false)
      setError('User not authenticated')
    }
  }, [user])

  const fetchReservations = async () => {
    try {
        setLoading(true)
        setError(null)

        const response = await fetch(
        `http://localhost:8080/api/reservations/my-reservations?userId=${user.id}`
        )

        if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData || 'Failed to fetch reservations')
        }

        const data = await response.json()

        // Sort by startTime ascending
        data.sort((a, b) => new Date(a.startTime) - new Date(b.startTime))

        setReservations(data)
    } catch (err) {
        console.error('Error fetching reservations:', err)
        setError(err.message)
    } finally {
        setLoading(false)
    }
    }

  const formatDateTime = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="my-reservations-container">
      <button className="back-button" onClick={onBack}>← Back</button>

      <h1>My Upcoming Reservations</h1>

      {loading && <p className="status-message">Loading reservations...</p>}
      {error && <p className="status-message error">{error}</p>}
      {!loading && !error && reservations.length === 0 && (
        <p className="status-message">You have no upcoming reservations.</p>
      )}

      <div className="reservations-grid">
        {reservations.map((res) => (
          <div key={res.id} className="reservation-card">
            <div className="reservation-header">
              <span className="reservation-space">Space ID: {res.spaceName}</span>
              <span className={`reservation-status ${res.startTime < new Date().toISOString() ? 'past' : 'upcoming'}`}>
                {res.startTime < new Date().toISOString() ? 'Past' : 'Upcoming'}
              </span>
            </div>
            <div className="reservation-info">
              <p><strong>Start:</strong> {formatDateTime(res.startTime)}</p>
              <p><strong>End:</strong> {formatDateTime(res.endTime)}</p>
              {res.notes && <p><strong>Notes:</strong> {res.notes}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyReservations
