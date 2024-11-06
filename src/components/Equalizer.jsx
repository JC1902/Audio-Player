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

function convert(value)
{
    if(value>=1000000)
    {
        value=(value/1000000)+"M"
    }
    else if(value>=1000)
    {
        value=(value/1000)+"K";
    }
    return value.toString();
}

const frequencyShort = bands.map((band) => convert(band.frequency));

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
    <div className="flex shrink items-center justify-center px-4 gap-4 mb-2 ">
      {filters.map((filter, index) => (
        <div key={index} >
          <input
            type="range"
            min="-100"
            max="100"
            step="1"
            value={filter.gain.value}
            onChange={(e) => handleGainChange(index, parseFloat(e.target.value))}
          />
          <br></br>
          <label className='text-white'>{frequencyShort[index]}Hz</label>
        </div>
      ))}
    </div>
  )
}
