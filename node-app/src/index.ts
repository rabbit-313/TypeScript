const printLine = (text: string, brakeLine: boolean = true) => {
  process.stdout.write(text + (brakeLine ? "\n" : ""));
};

const promptInput = async (text: string) => {
  printLine(`\n${text}`, false);
  const input: string = await new Promise((resolve) =>
    process.stdin.once("data", (data) => resolve(data.toString()))
  );
  return input.trim();
};

(async () => {
  const name = await promptInput("What is your name?");
  console.log(name);
  const age = await promptInput("How old are you?");
  console.log(age);
  process.exit();
})();
