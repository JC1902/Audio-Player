import { useEffect, useRef, useState } from 'react'
import { PlayIcon, PauseIcon, UploadIcon } from './Icons'
import Equalizer from './Equalizer'
import WaveSurfer from 'wavesurfer.js'
import MediaTags from './MediaTags'

export default function WaveSurferPlayer() {
  const waveformRef = useRef(null)
  const wavesurferRef = useRef(null)

  const [audioUrl, setAudioUrl] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState(null)

  const [audioContext, setAudioContext] = useState(null)
  const [mediaElementSource, setMediaElementSource] = useState(null)

  const [audioFile, setAudioFile] = useState(null)

  const initializeWaveSurfer = async () => {
    if (waveformRef.current && !wavesurferRef.current) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        setAudioContext(audioContext)

        const wavesurfer = WaveSurfer.create({
          container: waveformRef.current,
          waveColor: 'violet',
          progressColor: 'purple',
          cursorColor: 'navy',
          barWidth: 3,
          barRadius: 3,
          responsive: true,
          height: 150,
          autostart: false,
        })

        wavesurferRef.current = wavesurfer

        const mediaElementSource = audioContext.createMediaElementSource(wavesurfer.getMediaElement())
        setMediaElementSource(mediaElementSource)

        wavesurfer.on('play', () => setIsPlaying(true))
        wavesurfer.on('pause', () => setIsPlaying(false))
        wavesurfer.on('ready', () => setIsReady(true))
        wavesurfer.on('error', (err) => setError(`Error: ${err}`))

        await wavesurfer.load(audioUrl)
      } catch (err) {
        setError(`Failed to initialize WaveSurfer: ${err.message}`)
      }
    }
  }

  useEffect(() => {
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy()
      }
    }
  }, [])

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAudioFile(file)
      setAudioUrl(url)
      setError(null) // Reset error when a new file is selected
    }
  }

  const handleInitialize = async () => {
    if (audioUrl) {
      try {
        await initializeWaveSurfer()
      } catch (err) {
        setError(`Failed to initialize audio: ${err.message}`)
      }
    }
  }

  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause()
    }
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <>
      <div className="w-full h-full mx-auto p-4">
        <div
          ref={waveformRef}
          className="w-full h-52 p-6 mb-4 bg-black border-2 border-white rounded-lg"
        />

        <section className="container-player">

          { audioFile && <MediaTags audioFile={audioFile} className='grow' /> }

          <label className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-300 transition-colors">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <UploadIcon className='grow' />
          </label>
          {!wavesurferRef.current ? (
            <button
              onClick={handleInitialize}
              className="w-auto h-auto px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              Comenzar reproducción
            </button>
          ) : (
            <button
              onClick={handlePlayPause}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
              disabled={!isReady}
            >
              {isPlaying ? <PauseIcon className='grow' /> : <PlayIcon className='grow' />}
            </button>
          )}

          {audioContext && mediaElementSource && (
            <Equalizer audioContext={audioContext} mediaElementSource={mediaElementSource} />
          )}
        </section>

      </div>
    </>
  )
}
