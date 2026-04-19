import app from "ags/gtk4/app";
import style from "./style.scss";
import TaskBar from "./windows/taskbar/TaskBar";
import { currentMode, setMode, resetCommandState } from "./windows/taskbar/modes/modeSwitch";
import CommandPalette from "./windows/command-palette/CommandPalette";

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
      setMode("command")
    }
    if (cmd === "brightness-down") {
      setMode("command")
    }
    if (cmd === "volume-up") {
      setMode("command")
    }
    if (cmd === "volume-down") {
      setMode("command")
    }
    response("unknown command");
  },
  main() {
    app.get_monitors().map(TaskBar);
    app.get_monitors().map(CommandPalette);
  },
});
