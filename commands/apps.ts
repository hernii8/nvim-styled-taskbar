import AstalApps from "gi://AstalApps";
import { Command, SubItem } from "./registry";

const appsInstance = new AstalApps.Apps({
  nameMultiplier: 2,
  entryMultiplier: 0,
  executableMultiplier: 2,
});

const appsCommand: Command = {
  id: "apps",
  name: "App Launcher",
  icon: "󰣆",
  description: "Launch applications",
  getItems(query: string): SubItem[] {
    const results = query.trim()
      ? appsInstance.fuzzy_query(query)
      : appsInstance.get_list();
    return results.slice(0, 10).map((app) => ({
      id: app.entry ?? app.name,
      label: app.name,
      icon: app.iconName ?? "󰣆",
      description: app.description ?? "",
      action: () => app.launch(),
    }));
  },
};

export default appsCommand;
