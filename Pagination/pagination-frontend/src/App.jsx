import { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [nextCursor, setNextCursor] = useState(null)
  const limit = 50 // Number of items per page
  const observerTarget = useRef(null)

  const fetchCourses = async (cursor = null) => {
    try {
      setLoading(true)
      const params = { limit }
      if (cursor) {
        params.course_id = cursor
      }

      const response = await axios.get('http://localhost:3000/course', { params })
      const result = response.data

      setCourses(prevCourses => 
        cursor ? [...prevCourses, ...result.data.data] : result.data.data
      )
      setNextCursor(result.data.meta.pagaination.next_cursor)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch courses')
    } finally {
      setLoading(false)
    }
  }

  const handleObserver = useCallback((entries) => {
    const target = entries[0]
    if (target.isIntersecting && nextCursor && !loading) {
      fetchCourses(nextCursor)
    }
  }, [nextCursor, loading])

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 1.0
    }

    const observer = new IntersectionObserver(handleObserver, options)
    const currentTarget = observerTarget.current

    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [handleObserver])

  useEffect(() => {
    fetchCourses()
  }, [])

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  return (
    <div className="container">
      <h1>Course Listing</h1>
      <div className="course-grid">
        {courses.map(course => (
          <div key={course.course_id} className="course-card">
            <h3>{course.course_title}</h3>
            <p>Course ID: {course.course_id}</p>
            <p>Serial No: {course.sno}</p>
            <p>Created: {new Date(course.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
      
      {loading && <div className="loading">Loading...</div>}
      
      <div ref={observerTarget} style={{ height: '20px', margin: '20px 0' }} />
    </div>
  )
}

export default App
