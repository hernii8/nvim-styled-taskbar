import app from "ags/gtk4/app"
import style from "./style.scss"
import TaskBar from "./windows/taskbar/TaskBar"

app.start
  ({
    css: style,
    main() {
      app.get_monitors().map(TaskBar)
    },
  })
