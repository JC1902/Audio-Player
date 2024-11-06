import WaveSurferPlayer from './components/WaveSurferPlayer'
import { FirstWave } from './components/Waves'
import './App.css'

function App() {
  
  return (
    <>
      <div className='bg-black w-screen h-screen flex flex-col items-center justify-center'>
        <h1 className='text-white text-center text-4xl font-bold p-4'>Audio Player Editor</h1>
        <WaveSurferPlayer />
        <FirstWave />
      </div>
    </>
  )
}

export default App
