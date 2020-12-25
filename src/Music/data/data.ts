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
  const { artist = 'Unknown', album = 'Unknown', genre = 'Unknown' } = tags;
  let { year } = tags;
  let decade = '-';
  if (year) {
    decade = year.replace(/.$/, '0');
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

export const allArtists = Object.keys(byArtist);
export const allAlbums = Object.keys(byAlbum);
export const allGenres = Object.keys(byGenre);
export const allDecades = Object.keys(byDecade);
export const allYears = Object.keys(byYear);

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

