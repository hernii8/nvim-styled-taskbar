import NormalMode from "./NormalMode";
import CommandInput from "./CommandInput";

export default function Mode() {
  return (
    <box>
      <NormalMode />
      <CommandInput />
    </box>
  );
}
