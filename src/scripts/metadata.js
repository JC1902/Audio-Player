// src/utils/readMetadata.js
const jsmediatags = window.jsmediatags;

export function readAudioMetadata(file, onSuccess, onError) {
  jsmediatags.read(file, {
    onSuccess: (tag) => {
      console.log(tag);
      const { title, artist, album, genre, picture } = tag.tags;

      // Procesar la imagen en base64 si existe
      let imageUrl = null;
      if (picture) {
        const data = picture.data;
        const format = picture.format;
        let base64String = '';
        for (let i = 0; i < data.length; i++) {
          base64String += String.fromCharCode(data[i]);
        }
        imageUrl = `data:${format};base64,${window.btoa(base64String)}`;
      }

      // Ejecutar la función de éxito con los datos procesados
      onSuccess({
        title: title || 'Desconocido',
        artist: artist || 'Desconocido',
        album: album || 'Desconocido',
        genre: genre || 'Desconocido',
        imageUrl,
      });
    },
    onError: (error) => {
      if (onError) onError(error);
    }
  });
}
