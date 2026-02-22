import { createComputed, With } from "ags"
import CommandMode from "./CommandMode"
import NormalMode from "./NormalMode"
import { modeSwitch } from "./modeSwitch"

export default function Mode() {
	return (<box>
		<NormalMode />
		<CommandMode />
	</box>)
}
