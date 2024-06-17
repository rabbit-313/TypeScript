type Mode = "normal" | "hard" | "very hard";
const modes = ["normal", "hard", "very hard"] as const;
type Mode = (typeof modes)[number];

class HitAndBlow {
  private readonly answerSource: string[] = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ];
  private answer: string[] = [];
  private tryCount = 0;
  private mode: Mode = "normal";

  async setting() {
    this.mode = await promptSelect<Mode>("難易度を選択してください。", modes);
    const answerLength = this.getAnswerLength();
    while (this.answer.length < answerLength) {
      const randNum = Math.floor(Math.random() * this.answerSource.length);
      const selectedItem = this.answerSource[randNum];
      if (!this.answer.includes(selectedItem)) {
        this.answer.push(selectedItem);
      }
    }
  }

  end() {
    printLine(`正解です！\n${this.tryCount}回目でクリアしました！`, false);
    process.exit();
  }

  async play() {
    const answerLength = this.getAnswerLength();
    const inputArr = (
      await promptInput(
        `1~9の数字を${answerLength}桁「,」区切りで入力してください。`
      )
    ).split(",");

    if (!this.validate(inputArr)) {
      printLine("入力値が不正です。もう一度入力してください。");
      await this.play();
      return;
    }

    const result = this.check(inputArr);

    if (result.hit !== this.answer.length) {
      printLine(`hit: ${result.hit}, blow: ${result.blow}`);
      this.tryCount += 1;
      await this.play();
    } else {
      this.tryCount += 1;
    }
  }

  private check(input: string[]) {
    let hitCount = 0;
    let blowCount = 0;

    input.forEach((val, index) => {
      if (val === this.answer[index]) {
        hitCount += 1;
      } else if (this.answer.includes(val)) {
        blowCount += 1;
      }
    });

    return {
      hit: hitCount,
      blow: blowCount,
    };
  }

  private validate(inputArr: string[]) {
    const isLegendValid = inputArr.length === this.answer.length;
    const isAllAnswerSourceOption = inputArr.every((val) =>
      this.answerSource.includes(val)
    );
    const isAllUnique = inputArr.every((val, i) => inputArr.indexOf(val) === i);
    return isLegendValid && isAllAnswerSourceOption && isAllUnique;
  }

  private getAnswerLength() {
    switch (this.mode) {
      case "normal":
        return 3;
      case "hard":
        return 4;
      case "very hard":
        return 5;
      default:
        const neverValue: never = this.mode;
        throw new Error(`Unexpected mode: ${neverValue}`);
    }
  }
}

const printLine = (text: string, brakeLine: boolean = true) => {
  process.stdout.write(text + (brakeLine ? "\n" : ""));
};

const promptInput = async (text: string) => {
  printLine(`\n${text}`, false);
  return readLine();
};

const readLine = async () => {
  const input: string = await new Promise((resolve) =>
    process.stdin.once("data", (data) => resolve(data.toString()))
  );
  return input.trim();
};

const promptSelect = async <T extends string>(
  text: string,
  values: readonly T[]
): Promise<T> => {
  printLine(`\n${text}`);
  values.forEach((value) => {
    printLine(`- ${value}`);
  });
  printLine(`> `, false);

  const input = (await readLine()) as T;
  if (values.includes(input)) {
    return input;
  } else {
    return promptSelect<T>(text, values);
  }
};

(async () => {
  const hitAndBlow = new HitAndBlow();
  await hitAndBlow.setting();
  await hitAndBlow.play();
  hitAndBlow.end();
})();
