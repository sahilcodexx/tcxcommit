import chalk from "chalk";

const BOX_WIDTH = 50;

interface PrintBoxOptions {
  borderColor?: "cyan" | "red" | "green" | "yellow" | "blue" | "magenta";
  title?: string;
}

export function printBox(lines: string[], options: PrintBoxOptions = {}): void {
  const { borderColor = "cyan", title } = options;
  const border = chalk[borderColor]("─".repeat(BOX_WIDTH));
  const vertical = chalk[borderColor]("│");

  console.log(chalk[borderColor]("┌") + border + chalk[borderColor]("┐"));

  if (title) {
    const pad = " ".repeat(Math.floor((BOX_WIDTH - title.length) / 2));
    console.log(
      vertical +
        pad +
        chalk.bold(title) +
        " ".repeat(Math.max(0, BOX_WIDTH - pad.length - title.length)) +
        vertical
    );
    console.log(chalk[borderColor]("├") + border + chalk[borderColor]("┤"));
  }

  lines.forEach((line) => {
    console.log(
      vertical +
        " " +
        line +
        " ".repeat(Math.max(0, BOX_WIDTH - line.length)) +
        vertical
    );
  });

  console.log(chalk[borderColor]("└") + border + chalk[borderColor]("┘"));
}

export function spinner(msg: string): () => void {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let i = 0;
  const interval = setInterval(() => {
    process.stderr.write(
      `\r${chalk.cyan(frames[i++ % frames.length])} ${msg}`
    );
  }, 80);
  return () => {
    clearInterval(interval);
    process.stderr.write("\r" + " ".repeat(msg.length + 3) + "\r");
  };
}
