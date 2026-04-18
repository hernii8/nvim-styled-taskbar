import app from "ags/gtk4/app";
import style from "./style.scss";
import TaskBar from "./windows/taskbar/TaskBar";
import CommandPalette from "./windows/command-palette/CommandPalette";
import { currentMode, setMode, resetCommandState } from "./windows/taskbar/modes/modeSwitch";

app.start({
  css: style,
  main() {
    app.get_monitors().map((monitor) => {
      TaskBar(monitor);
      CommandPalette(monitor);
    });

    app.connect("request", (_a: object, request: string, res: (r: string) => void) => {
      if (request === "toggle-command") {
        if (currentMode.get() === "normal") {
          setMode("command");
        } else {
          setMode("normal");
          resetCommandState();
        }
        res("ok");
      }
    });
  },
});
