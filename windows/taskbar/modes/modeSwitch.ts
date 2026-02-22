import { createState } from "ags";

export const [modeSwitch, setMode] = createState<"normal" | "command">("command");
