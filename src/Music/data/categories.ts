export enum CategoryType {
  ARTIST = 'Artist',
  ALBUM = 'Album',
  GENRE = 'Genre',
  DECADE = 'Decade',
  YEAR = 'Year',
}

export const CATEGORY_NAMES = {
  [CategoryType.ARTIST]: 'artist',
  [CategoryType.ALBUM]: 'album',
  [CategoryType.GENRE]: 'genre',
  [CategoryType.DECADE]: 'decade',
  [CategoryType.YEAR]: 'year',
};

export const CATEGORY_PATHS = {
  [CategoryType.ARTIST]: 'artist',
  [CategoryType.ALBUM]: 'album',
  [CategoryType.GENRE]: 'genre',
  [CategoryType.DECADE]: 'decade',
  [CategoryType.YEAR]: 'year',
};

export const PATH_TO_CATEGORY: {[path: string]: CategoryType} = {};

Object.values(CategoryType).forEach(category => {
  PATH_TO_CATEGORY[CATEGORY_PATHS[category]] = category;
});