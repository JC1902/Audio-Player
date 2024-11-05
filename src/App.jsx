import WaveSurferPlayer from './components/WaveSurferPlayer'
import audio from './assets/audio.mp3'
import { FirstWave } from './components/Waves'
import './App.css'

function App() {
  
  return (
    <>
      <div className='bg-black w-screen h-screen flex flex-col items-center justify-center'>
        <h1 className='text-white text-center text-4xl font-bold p-4'>Audio Player Editor</h1>
        <WaveSurferPlayer className='zIndex-2' audioUrl={audio} />
        <FirstWave />
      </div>
    </>
  )
}

export default App
