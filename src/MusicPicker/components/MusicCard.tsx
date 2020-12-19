import { Card, Typography } from "@material-ui/core";

interface Props {
  musicDatum: MusicDatum;
}
export function MusicCard(props: Props) {
  const { tags: {
    title,
    artist,
    // album,
    // genre,
    // composer,
    // length,
  }} = props.musicDatum;
  return (
    <Card>
      <Typography variant="h5">Title: {title ?? 'Unknown'}</Typography>
      <Typography variant="h6">Artist: {artist ?? 'Unknown'}</Typography>
    </Card>
  )
}