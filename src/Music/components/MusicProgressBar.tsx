import { LinearProgress } from "@material-ui/core";
import { useMusicPlayerContext } from "../MusicPlayer/MusicPlayerProvider";

export function MusicProgressBar() {
  const {
    playbackTime,
    currentTime,
    isLoading,
  } = useMusicPlayerContext();
  if (isLoading) {
    return <LinearProgress />
  }
  return <LinearProgress variant="determinate" value={currentTime > 0 && playbackTime > 0 ? (100 * currentTime / playbackTime) : 0} />
}