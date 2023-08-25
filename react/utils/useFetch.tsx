import { useEffect, useState } from 'react'

const useFetch = (url: string) => {
  const [status, setStatus] = useState('idle')
  const [data, setData] = useState([])
  const [error, setError] = useState(0)

  useEffect(() => {
    if (!url) return
    const fetchData = async () => {
      setStatus('fetching')
      try {
        const response = await fetch(url)
        if (response.status >= 400) {
          setError(response.status)
        } else {
          const data = await response.json()
          setData(data)
        }
        setStatus('fetched')
      } catch (error) {
        setError(error.message)
        setStatus('error')
      }
    }

    fetchData()
  }, [url])

  return { status, data, error }
}

export default useFetch
