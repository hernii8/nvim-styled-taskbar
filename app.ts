import app from "ags/gtk4/app";
import style from "./style.scss";
import TaskBar from "./windows/taskbar/TaskBar";
import { currentMode, setMode, resetCommandState, setSliderTarget } from "./windows/taskbar/modes/modeSwitch";
import CommandPalette from "./windows/command-palette/CommandPalette";
import { adjustSlider } from "./widget/SliderWidget";

app.start({
  css: style,
  requestHandler(argv: string[], response: (r: string) => void) {
    const [cmd] = argv;
    if (cmd === "toggle-command") {
      if (currentMode.peek() === "normal") {
        setMode("command");
      } else {
        setMode("normal");
        resetCommandState();
      }
      return response("ok");
    }
    if (cmd === "brightness-up") {
      setSliderTarget("brightness")
      adjustSlider(1)
    }
    if (cmd === "brightness-down") {
      setSliderTarget("brightness")
      adjustSlider(-1)
    }
    if (cmd === "volume-up") {
      setSliderTarget("volume")
      adjustSlider(1)
    }
    if (cmd === "volume-down") {
      setSliderTarget("volume")
      adjustSlider(-1)
    }
    response("unknown command");
  },
  main() {
    app.get_monitors().map(TaskBar);
    app.get_monitors().map(CommandPalette);
  },
});
