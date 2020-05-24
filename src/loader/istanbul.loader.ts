import path from "path";
import fs from "fs";
import { Loader } from "./index";
import { Coverage } from "../type";

export class IstanbulLoader implements Loader {
  private coverageDir: string;
  constructor(coverageDir: string) {
    this.coverageDir = coverageDir;
  }
  async load(): Promise<Coverage> {
    const file = path.join(this.coverageDir, "coverage-final.json");
    const data = await fs.promises.readFile(file, { encoding: "utf8" });

    return JSON.parse(data);
  }
}
