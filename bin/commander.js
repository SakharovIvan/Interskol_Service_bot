import { Command } from "commander";
import { updateBDdata } from "../src/sqldata/updatealldata.js";

const program = new Command();

program
  .name("telegabot-helper")
  .version("0.1.0")
  .description("Update all information from bd")
  .argument("<filepath>")
  .option(
    "-f, --format <type>",
    "types of BD ToolSPmatNo | ToolPath | SPmatNo default - error"
  )
  .helpOption("-h, --help", "output usage information")
  .action(async (filepath, option) => {
    const res = await updateBDdata(filepath, option.format);
    console.log(res);
  });

program.parse();
