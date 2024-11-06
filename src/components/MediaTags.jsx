// AudioMetadata.js
import { useEffect, useState } from 'react';
import { readAudioMetadata } from '../scripts/metadata';

export default function MediaTags({ audioFile }) {
  const [metadata, setMetadata] = useState({
    title: 'Título',
    artist: 'Artista',
    album: 'Álbum',
    genre: 'Género',
    imageUrl: null,
  });

  useEffect(() => {
    if (audioFile) {
      readAudioMetadata(
        audioFile,
        (data) => setMetadata(data),
        (error) => console.error('Error leyendo metadatos:', error)
      );
    }
  }, [audioFile]);

  return (
    <>
      <div className='flex flex-col' >
        <div
          id="cover"
          style={{
            width: 400,
            height: 250,
            backgroundSize: 'cover',
            backgroundImage: metadata.imageUrl ? `url(${metadata.imageUrl})` : 'none',
          }}
        ></div>
        <p id="title"  className='text-white text-lg' >{metadata.title}</p>
        <p id="artist" className='text-white' >{metadata.artist}</p>
        <p id="album" className='text-white' >{metadata.album}</p>
        <p id="genre" className='text-white' >{metadata.genre}</p>
      </div>
    </>
  );
}
