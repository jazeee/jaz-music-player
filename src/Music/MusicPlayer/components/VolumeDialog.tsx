import { DialogContent, Dialog, DialogTitle, Slider } from "@material-ui/core";
import { useMusicPlayerContext } from "../MusicPlayerProvider";

interface Props {
  setIsVisible: (isVisible: boolean) => any;
}

export function VolumeDialog(props: Props) {
  const { setIsVisible} = props;
  const {
    volume,
    setVolume,
  } = useMusicPlayerContext();
  return (
    <Dialog onClose={() => setIsVisible(false)} open>
      <DialogTitle>Set Volume</DialogTitle>
      <DialogContent>
        <Slider
          valueLabelDisplay="auto"
          valueLabelFormat={value => Math.round(value * 100)}
          value={volume} max={1.0} step={0.01} onChange={(__event, newVolume) => {
            setVolume(newVolume as number)
          }} />
      </DialogContent>
    </Dialog>
  );
}