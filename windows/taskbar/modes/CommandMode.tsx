import { createState, For } from "ags";
import { modeSwitch, setMode } from "./modeSwitch";
import AstalApps from "gi://AstalApps"

import { Astal, Gtk, Gdk } from "ags/gtk4"

export default function CommandMode() {
	const [cmd, setCmd] = createState(":");
	const [list, setList] = createState(new Array<AstalApps.Application>())
	const apps = new AstalApps.Apps()
	function search(text: string) {
		if (text === "") setList([])
		else setList(apps.fuzzy_query(text).slice(0, 8))
	}
	function launch(app?: AstalApps.Application) {
		if (app) {
			app.launch()
		}
	}
	// close on ESC
	// handle alt + number key
	function onKey(
		_e: Gtk.EventControllerKey,
		keyval: number,
		_: number,
		mod: number,
	) {
		if (keyval === Gdk.KEY_Escape) {
			win.visible = false
			return
		}

		if (mod === Gdk.ModifierType.ALT_MASK) {
			for (const i of [1, 2, 3, 4, 5, 6, 7, 8, 9] as const) {
				if (keyval === Gdk[`KEY_${i}`]) {
					return launch(list.get()[i - 1])
				}
			}
		}
	}

	return <box
		name="launcher-content"
		valign={Gtk.Align.CENTER}
		halign={Gtk.Align.CENTER}
		orientation={Gtk.Orientation.VERTICAL}
	>
		<entry
			onNotifyText={({ text }) => search(text)}
		/>
		<Gtk.Separator visible={list((l) => l.length > 0)} />
		<box orientation={Gtk.Orientation.VERTICAL} >
			<For each={list}>
				{(app, index) => (
					<button onClicked={() => launch(app)}>
						<box>
							<image iconName={app.iconName} />
							<label label={app.name} maxWidthChars={40} wrap />
							<label
								hexpand
								halign={Gtk.Align.END}
								label={index((i) => `󰘳${i + 1}`)}
							/>
						</box>
					</button>
				)}
			</For>
		</box>
	</box>
}
