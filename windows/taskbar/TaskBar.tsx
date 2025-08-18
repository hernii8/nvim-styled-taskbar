

import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { createPoll } from "ags/time"
import Battery from "../../widget/battery/Battery"
import Workspaces from "../../widget/Workspaces"
import Network from "../../widget/network/Network"
import StatusLineDivider from "../../widget/StatusLineDivider"

function RightSection() {
	const time = createPoll("", 1000, "date '+%H:%M'")

	return (
		<box $type="end" spacing={12} halign={Gtk.Align.END}>
			<StatusLineDivider />
			<Battery />
			<StatusLineDivider />
			<menubutton halign={Gtk.Align.CENTER}>
				<label label={time} />
				<popover>
					<Gtk.Calendar />
				</popover>
			</menubutton>
			<StatusLineDivider />
			<Network />
			{/* TODO: BLUETOOTH */}
			<Workspaces />
		</box>
	)
}

function StatusLine() {
	const activeWindowTitle = createPoll("N/A", 1000, `bash -c "hyprctl activewindow -j | jq -r '.title'"`)
	const LOGO_GLYPH = ""

	return (
		<centerbox cssName="centerbox">
			<box $type="start" spacing={8} halign={Gtk.Align.START}>
				<label class="arch-logo" label={LOGO_GLYPH} />
				<stack $={(self) => (self.visibleChildName = "child2")}>
					<label hexpand xalign={0} label={activeWindowTitle} $type="named" name="child2" />
				</stack>
				{/* <NormalMode /> */}
				{/* <AppLauncherMode gdkmonitor={gdkmonitor} /> */}
				{/* <CommandMode gdkmonitor={gdkmonitor} /> */}
				{/* <WallpapersMode gdkmonitor={gdkmonitor} /> */}
			</box>

			<RightSection />
		</centerbox>
	)
}

export default function TaskBar(gdkmonitor: Gdk.Monitor) {
	const { TOP, LEFT, RIGHT } = Astal.WindowAnchor
	return (
		<window
			visible
			name="bar"
			class="Bar"
			gdkmonitor={gdkmonitor}
			exclusivity={Astal.Exclusivity.EXCLUSIVE}
			anchor={TOP | LEFT | RIGHT}
			application={app}
		>
			<StatusLine />
		</window>
	)
}
