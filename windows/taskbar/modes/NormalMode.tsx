import ActiveWindow from "../../../widget/ActiveWindow";
import Logo from "../../../widget/Logo";
import { modeSwitch } from "./modeSwitch";

export default function NormalMode() {
  return <box>
    <Logo />
    <ActiveWindow />
  </box>
}
