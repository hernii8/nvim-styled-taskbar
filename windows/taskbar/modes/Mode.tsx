import NormalMode from "./NormalMode";
import CommandMode from "./CommandMode";
import { currentMode } from "./modeSwitch";

export default function Mode() {
  return (
    <box>
      <box
        visible={currentMode((v) => v === "normal")}
      >
        <NormalMode />
      </box>
      <box
        visible={currentMode((v) => v === "command")}
      >
        <CommandMode />
      </box>
    </box>
  );
}
