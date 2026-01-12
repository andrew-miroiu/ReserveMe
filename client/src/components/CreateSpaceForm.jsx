import { useState } from 'react'
import './CreateSpaceForm.css'

function CreateSpaceForm({ onBack, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    capacity: '',
    location: '',
    equipment: '',
    available: true
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required')
      setLoading(false)
      return
    }
    if (!formData.type.trim()) {
      setError('Type is required')
      setLoading(false)
      return
    }
    if (!formData.capacity || formData.capacity <= 0) {
      setError('Capacity must be a positive number')
      setLoading(false)
      return
    }
    if (!formData.location.trim()) {
      setError('Location is required')
      setLoading(false)
      return
    }

    try {
      const requestBody = {
        name: formData.name.trim(),
        type: formData.type.trim(),
        capacity: parseInt(formData.capacity),
        location: formData.location.trim(),
        available: formData.available,
        equipment: formData.equipment.trim() || null
      }

      const response = await fetch('http://localhost:8080/api/spaces/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(errorData || 'Failed to create space')
      }

      const createdSpace = await response.json()
      console.log('Space created successfully:', createdSpace)
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setError(err.message || 'An error occurred while creating the space')
      console.error('Error creating space:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-space-container">
      <button onClick={onBack} className="back-button">← Back</button>
      
      <div className="create-space-card">
        <h1>Create New Space</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter space name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Type *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select type</option>
              <option value="study">Study Room</option>
              <option value="gym">Gym Room</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="capacity">Capacity *</label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              min="1"
              placeholder="Enter capacity"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="Enter location"
            />
          </div>

          <div className="form-group">
            <label htmlFor="equipment">Equipment</label>
            <textarea
              id="equipment"
              name="equipment"
              value={formData.equipment}
              onChange={handleChange}
              placeholder="Enter equipment details (optional)"
              rows="4"
            />
          </div>

          <div className="form-group checkbox-group">
            <label htmlFor="available" className="checkbox-label">
              <input
                type="checkbox"
                id="available"
                name="available"
                checked={formData.available}
                onChange={handleChange}
              />
              <span>Available</span>
            </label>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Creating...' : 'Create Space'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateSpaceForm
