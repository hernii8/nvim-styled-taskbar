import app from "ags/gtk4/app";
import style from "./style.scss";
import TaskBar from "./windows/taskbar/TaskBar";
import { currentMode, setMode, resetCommandState } from "./windows/taskbar/modes/modeSwitch";

app.start({
  css: style,
  requestHandler(argv: string[], response: (r: string) => void) {
    const [cmd] = argv;
    if (cmd === "toggle-command") {
      if (currentMode.get() === "normal") {
        setMode("command");
      } else {
        setMode("normal");
        resetCommandState();
      }
      return response("ok");
    }
    response("unknown command");
  },
  main() {
    app.get_monitors().map(TaskBar);
  },
});
