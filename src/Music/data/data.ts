import { CategoryType } from "./categories";

const musicData: Array<MusicDatum> = require('./music.json');

export {musicData};

export const byArtist: {[key: string]: Array<number>} = {};
export const byAlbum: { [key: string]: Array<number> } = {};
export const byGenre: {[key: string]: Array<number>}  = {};
export const byYear: {[key: string]: Array<number>}  = {};
export const byDecade: {[key: string]: Array<number>}  = {};
export const ALL_INDICES: Array<number> = [];

musicData.forEach((datum, index) => {
  const { tags } = datum;
  const { artist = 'Unknown', album = 'Unknown', genre = 'Unknown', title = 'Unknown', length: durationInMilliseconds = 0 } = tags;
  datum.description = `${artist ? artist + ": " : ''}${title}`;
  datum.durationInSeconds = Number(durationInMilliseconds) / 1000;
  let { year } = tags;
  let decade = '-';
  if (year) {
    decade = String(year).replace(/.$/, '0');
  } else {
    year = '-';
  }
  byDecade[decade] ? byDecade[decade]?.push(index) : byDecade[decade] =  [index];
  byYear[year] ? byYear[year]?.push(index) : byYear[year] =  [index];
  byArtist[artist] ? byArtist[artist]?.push(index) : byArtist[artist] =  [index];
  byGenre[genre] ? byGenre[genre]?.push(index) : byGenre[genre] =  [index];
  byAlbum[album] ? byAlbum[album]?.push(index) : byAlbum[album] =  [index];
  ALL_INDICES.push(index);
});

function compareIgnoreCase(a:string, b: string) {
  return a.localeCompare(b, 'en', { sensitivity: 'base'});
}
export const allArtists = Object.keys(byArtist).sort(compareIgnoreCase);
export const allAlbums = Object.keys(byAlbum).sort(compareIgnoreCase);
export const allGenres = Object.keys(byGenre).sort(compareIgnoreCase);
export const allDecades = Object.keys(byDecade).sort(compareIgnoreCase);
export const allYears = Object.keys(byYear).sort(compareIgnoreCase);

export const ALL_BY_CATEGORY: {[key in CategoryType]: Array<string>} = {
  [CategoryType.ARTIST]: allArtists,
  [CategoryType.ALBUM]: allAlbums,
  [CategoryType.GENRE]: allGenres,
  [CategoryType.DECADE]: allDecades,
  [CategoryType.YEAR]: allYears,
}

export const MUSIC_BY_CATEGORY = {
  [CategoryType.ARTIST]: byArtist,
  [CategoryType.ALBUM]: byAlbum,
  [CategoryType.GENRE]: byGenre,
  [CategoryType.DECADE]: byDecade,
  [CategoryType.YEAR]: byYear,
}

