import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import Battery from "../../widget/battery/Battery"
import Workspaces from "../../widget/Workspaces"
import Network from "../../widget/network/Network"
import StatusLineDivider from "../../widget/StatusLineDivider"
import Date from "../../widget/Date"
import Bluetooth from "../../widget/bluetooth/Bluetooth"
import Mode from "./modes/Mode"

export default function TaskBar(gdkmonitor: Gdk.Monitor) {
	const { TOP, LEFT, RIGHT } = Astal.WindowAnchor
	return (
		<window
			keymode={Astal.Keymode.ON_DEMAND}
			visible
			name="bar"
			class="Bar"
			gdkmonitor={gdkmonitor}
			exclusivity={Astal.Exclusivity.EXCLUSIVE}
			anchor={TOP | LEFT | RIGHT}
			application={app}
		>
			<centerbox cssName="centerbox">
				<box $type="start" spacing={8} halign={Gtk.Align.START} >
					<Mode />
				</box>

				<box $type="end" spacing={12} halign={Gtk.Align.END}>
					<StatusLineDivider />
					<Battery />
					<StatusLineDivider />
					<Date />
					<StatusLineDivider />
					<Network />
					<StatusLineDivider />
					<Bluetooth />
					<Workspaces />
				</box>
			</centerbox>
		</window>
	)
}
