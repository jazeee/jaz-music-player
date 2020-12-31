interface MusicDatum {
  fileName: string;
  description: string;
  durationInSeconds: number;
  tags: {
    album?: string;
    artist?: string;
    title?: string;
    genre?: string;
    year?: string;
    composer?: string;
    trackNumber?: string;
    length?: string;
  }
}
