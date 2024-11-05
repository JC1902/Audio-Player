import { useEffect, useState } from 'react'

const bands = [
  { frequency: 32, type: 'lowshelf' },
  { frequency: 64, type: 'peaking' },
  { frequency: 125, type: 'peaking' },
  { frequency: 250, type: 'peaking' },
  { frequency: 500, type: 'peaking' },
  { frequency: 1000, type: 'peaking' },
  { frequency: 2000, type: 'peaking' },
  { frequency: 4000, type: 'peaking' },
  { frequency: 8000, type: 'peaking' },
  { frequency: 16000, type: 'highshelf' }
]

export default function Equalizer({ audioContext, mediaElementSource }) {
  const [filters, setFilters] = useState([])

  useEffect(() => {
    const createFilters = () => {
      const filters = bands.map(band => {
        const filter = audioContext.createBiquadFilter()
        filter.type = band.type
        filter.frequency.value = band.frequency
        filter.gain.value = 0 // Valor inicial
        return filter
      })
      return filters
    }

    const filters = createFilters()
    setFilters(filters)

    // Conectar los filtros en cadena
    mediaElementSource.connect(filters[0])
    filters.forEach((filter, i) => {
      if (filters[i + 1]) {
        filter.connect(filters[i + 1])
      }
    })
    filters[filters.length - 1].connect(audioContext.destination)

    return () => {
      filters.forEach(filter => filter.disconnect())
    }
  }, [audioContext, mediaElementSource])

  const handleGainChange = (index, value) => {
    const newFilters = [...filters]
    newFilters[index].gain.value = value
    setFilters(newFilters)
  }

  return (
    <div>
      {filters.map((filter, index) => (
        <div key={index} className="flex items-center gap-4 mb-2 ">
          <label className='text-white'>{bands[index].frequency} Hz</label>
          <input
            type="range"
            min="-30"
            max="30"
            step="1"
            value={filter.gain.value}
            onChange={(e) => handleGainChange(index, parseFloat(e.target.value))}
          />
        </div>
      ))}
    </div>
  )
}
