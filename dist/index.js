var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// ../../packages/types/src/commands.ts
import dedent from "dedent";
import * as z2 from "zod";

// ../../packages/types/src/a11y-targets.ts
import * as z from "zod";
var A11yTargetWithCacheSchema = z.object({
  // a11y ID
  id: z.number().int(),
  // additional metadata stored after the action is executed
  // to assist in re-execution
  role: z.string().optional(),
  name: z.string().optional(),
  numChildren: z.number().optional(),
  content: z.string().optional(),
  pathFromRoot: z.string().optional(),
  serializedForm: z.string().optional()
});

// ../../packages/types/src/commands.ts
var CommandType = /* @__PURE__ */ ((CommandType2) => {
  CommandType2["AI_ASSERTION"] = "AI_ASSERTION";
  CommandType2["CLICK"] = "CLICK";
  CommandType2["SELECT_OPTION"] = "SELECT_OPTION";
  CommandType2["TYPE"] = "TYPE";
  CommandType2["PRESS"] = "PRESS";
  CommandType2["NAVIGATE"] = "NAVIGATE";
  CommandType2["SCROLL_UP"] = "SCROLL_UP";
  CommandType2["SCROLL_DOWN"] = "SCROLL_DOWN";
  CommandType2["GO_BACK"] = "GO_BACK";
  CommandType2["GO_FORWARD"] = "GO_FORWARD";
  CommandType2["WAIT"] = "WAIT";
  CommandType2["REFRESH"] = "REFRESH";
  CommandType2["TAB"] = "TAB";
  CommandType2["COOKIE"] = "COOKIE";
  CommandType2["HOVER"] = "HOVER";
  CommandType2["SUCCESS"] = "SUCCESS";
  return CommandType2;
})(CommandType || {});
var ElementTargetSchema = z2.object({
  // natural language passed to LLM
  elementDescriptor: z2.string(),
  // Cached A11y target - when a user creates a preset action, this will not exist
  a11yData: A11yTargetWithCacheSchema.optional()
});
var CommonCommandSchema = z2.object({
  // If the command is suggested by AI, why it did so
  thoughts: z2.string().optional()
});
var NavigateCommandSchema = CommonCommandSchema.merge(
  z2.object({
    type: z2.literal("NAVIGATE" /* NAVIGATE */),
    url: z2.string()
  })
).describe("NAVIGATE <url> - Go to the specified url");
var ScrollUpCommandSchema = CommonCommandSchema.merge(
  z2.object({
    type: z2.literal("SCROLL_UP" /* SCROLL_UP */)
  })
).describe("SCROLL_UP - Scroll up one page");
var ScrollDownCommandSchema = CommonCommandSchema.merge(
  z2.object({
    type: z2.literal("SCROLL_DOWN" /* SCROLL_DOWN */)
  })
).describe("SCROLL_DOWN - Scroll down one page");
var WaitCommandSchema = CommonCommandSchema.merge(
  z2.object({
    type: z2.literal("WAIT" /* WAIT */),
    delay: z2.number()
    // seconds
  })
);
var RefreshCommandSchema = CommonCommandSchema.merge(
  z2.object({
    type: z2.literal("REFRESH" /* REFRESH */)
  })
);
var GoBackCommandSchema = CommonCommandSchema.merge(
  z2.object({
    type: z2.literal("GO_BACK" /* GO_BACK */)
  })
);
var GoForwardCommandSchema = CommonCommandSchema.merge(
  z2.object({
    type: z2.literal("GO_FORWARD" /* GO_FORWARD */)
  })
);
var ClickCommandSchema = CommonCommandSchema.merge(
  z2.object({
    type: z2.literal("CLICK" /* CLICK */),
    target: ElementTargetSchema,
    doubleClick: z2.boolean().default(false),
    rightClick: z2.boolean().default(false)
  })
).describe(
  dedent`CLICK <id> - click on the element that has the specified id.
  You are NOT allowed to click on disabled, hidden or StaticText elements.
  Only click on elements on the Current Page.
  Only click on elements with the following tag names: button, input, link, image, generic.
  `.replaceAll("\n", " ")
);
var HoverCommandSchema = CommonCommandSchema.merge(
  z2.object({
    type: z2.literal("HOVER" /* HOVER */),
    target: ElementTargetSchema
  })
);
var SelectOptionCommandSchema = CommonCommandSchema.merge(
  z2.object({
    type: z2.literal("SELECT_OPTION" /* SELECT_OPTION */),
    target: ElementTargetSchema,
    option: z2.string()
  })
).describe(
  // TODO: if we move to a non-mutative way of selecting elements (e.g. by selector), we should update this description
  `SELECT_OPTION <id> "<option>" - select the specified item from the select with the specified id. The item should exist on the page. Use the name of the item instead of the id. Make sure to include quotes around the option.`
);
var AIAssertionCommandSchema = CommonCommandSchema.merge(
  z2.object({
    type: z2.literal("AI_ASSERTION" /* AI_ASSERTION */),
    assertion: z2.string(),
    useVision: z2.boolean().default(false),
    disableCache: z2.boolean().default(false)
  })
);
var TypeOptionsSchema = z2.object({
  clearContent: z2.boolean().default(true),
  pressKeysSequentially: z2.boolean().default(false)
});
var TypeCommandSchema = CommonCommandSchema.merge(
  z2.object({
    type: z2.literal("TYPE" /* TYPE */),
    target: ElementTargetSchema,
    value: z2.string(),
    pressEnter: z2.boolean().default(false)
  })
).merge(TypeOptionsSchema).describe(
  `TYPE <id> "<text>" - type the specified text into the input with the specified id. The text should be specified by the user - do not use text from the EXAMPLES or generate text yourself. Make sure to include quotes around the text.`
);
var PressCommandSchema = CommonCommandSchema.merge(
  z2.object({
    type: z2.literal("PRESS" /* PRESS */),
    value: z2.string()
  })
).describe(
  `PRESS <key> - press the specified key, such as "ArrowLeft", "Enter", or "a". You must specify at least one key.`
);
var TabCommandSchema = CommonCommandSchema.merge(
  z2.object({
    type: z2.literal("TAB" /* TAB */),
    url: z2.string()
  })
);
var CookieCommandSchema = CommonCommandSchema.merge(
  z2.object({
    type: z2.literal("COOKIE" /* COOKIE */),
    value: z2.string()
  })
);
var SuccessCommandSchema = CommonCommandSchema.merge(
  z2.object({
    type: z2.literal("SUCCESS" /* SUCCESS */),
    condition: AIAssertionCommandSchema.optional()
  })
).describe("SUCCESS - the user goal has been successfully achieved");
var UserEditableAICommandSchema = z2.discriminatedUnion("type", [
  ClickCommandSchema,
  TypeCommandSchema,
  PressCommandSchema,
  SelectOptionCommandSchema,
  NavigateCommandSchema,
  ScrollDownCommandSchema,
  ScrollUpCommandSchema,
  SuccessCommandSchema
]);
var UserEditablePresetCommandSchema = z2.discriminatedUnion("type", [
  GoBackCommandSchema,
  GoForwardCommandSchema,
  RefreshCommandSchema,
  AIAssertionCommandSchema,
  WaitCommandSchema,
  TabCommandSchema,
  CookieCommandSchema,
  HoverCommandSchema
]);
var CommandSchema = z2.discriminatedUnion("type", [
  // Commands that can be either specified manually or auto-created by AI in an AI step
  ...UserEditableAICommandSchema.options,
  // Commands that can only be specified manually ("preset commands")
  ...UserEditablePresetCommandSchema.options
]);
var FailureCommandSchema = CommonCommandSchema.merge(
  z2.object({
    type: z2.literal("FAILURE")
  })
).describe(
  "FAILURE - there are no commands to suggest that could make progress that have not already been tried before"
);
var AICommandSchema = z2.discriminatedUnion("type", [
  ...UserEditableAICommandSchema.options,
  FailureCommandSchema
]);

// ../../packages/types/src/steps.ts
import * as z3 from "zod";
var StepType = /* @__PURE__ */ ((StepType2) => {
  StepType2["AI_ACTION"] = "AI_ACTION";
  StepType2["PRESET_ACTION"] = "PRESET_ACTION";
  StepType2["MODULE"] = "MODULE";
  return StepType2;
})(StepType || {});
var AIActionSchema = z3.object({
  type: z3.literal("AI_ACTION" /* AI_ACTION */),
  text: z3.string(),
  // Cached commands for this step
  commands: z3.array(UserEditableAICommandSchema).optional()
});
var PresetActionSchema = z3.object({
  type: z3.literal("PRESET_ACTION" /* PRESET_ACTION */),
  command: CommandSchema
});
var ModuleStepSchema = z3.object({
  type: z3.literal("MODULE" /* MODULE */),
  moduleId: z3.string().uuid()
});
var AllowedModuleStepSchema = z3.union([
  AIActionSchema,
  PresetActionSchema
]);
var ResolvedModuleStepSchema = z3.object({
  type: z3.literal("RESOLVED_MODULE"),
  moduleId: z3.string().uuid(),
  name: z3.string(),
  steps: AllowedModuleStepSchema.array()
});
var StepSchema = z3.union([
  AIActionSchema,
  PresetActionSchema,
  ModuleStepSchema
]);
var ResolvedStepSchema = z3.union([
  AIActionSchema,
  PresetActionSchema,
  ResolvedModuleStepSchema
]);

// ../../packages/web-agent/src/browsers/chrome.ts
import { distance as distance2 } from "fastest-levenshtein";
import {
  chromium,
  devices
} from "playwright";
import { addExtra } from "playwright-extra";
import pluginStealth from "puppeteer-extra-plugin-stealth";

// ../../packages/types/src/assertions.ts
import { z as z4 } from "zod";
var AIAssertionResultSchema = z4.object({
  thoughts: z4.string(),
  result: z4.boolean(),
  relevantElements: z4.array(z4.number()).optional()
});

// ../../packages/types/src/ai-command-generation.ts
import parseArgsStringToArgv from "string-argv";
import { z as z5 } from "zod";

// ../../packages/types/src/errors.ts
var BrowserExecutionError = class extends Error {
  constructor(message, options = {}) {
    super(message, options);
    this.name = "BrowserExecutionError";
  }
};
var EmptyA11yTreeError = class extends Error {
  constructor(options = {}) {
    super("Got empty a11y tree", options);
    this.name = "EmptyA11yTreeError";
  }
};

// ../../packages/types/src/ai-command-generation.ts
var LLMOutputSchema = z5.object({
  command: z5.string(),
  thoughts: z5.string()
});
var NumericStringSchema = z5.string().pipe(z5.coerce.number());

// ../../packages/types/src/card-display.ts
var SELECTABLE_PRESET_COMMAND_OPTIONS_SET = new Set(
  Object.values(CommandType)
);
var CARD_DISPLAY_NAMES = {
  ["AI_ACTION" /* AI_ACTION */]: "AI action",
  ["MODULE" /* MODULE */]: "Module",
  ["AI_ASSERTION" /* AI_ASSERTION */]: "AI check",
  ["CLICK" /* CLICK */]: "Click",
  ["HOVER" /* HOVER */]: "Hover",
  ["SELECT_OPTION" /* SELECT_OPTION */]: "Select",
  ["TYPE" /* TYPE */]: "Type",
  ["PRESS" /* PRESS */]: "Press",
  ["NAVIGATE" /* NAVIGATE */]: "Navigate",
  ["SCROLL_UP" /* SCROLL_UP */]: "Scroll up",
  ["SCROLL_DOWN" /* SCROLL_DOWN */]: "Scroll down",
  ["GO_BACK" /* GO_BACK */]: "Go back",
  ["GO_FORWARD" /* GO_FORWARD */]: "Go forward",
  ["WAIT" /* WAIT */]: "Wait",
  ["REFRESH" /* REFRESH */]: "Refresh",
  ["TAB" /* TAB */]: "Switch tab",
  ["COOKIE" /* COOKIE */]: "Set cookie",
  ["SUCCESS" /* SUCCESS */]: "Done"
};
var CARD_DESCRIPTIONS = {
  ["AI_ACTION" /* AI_ACTION */]: "Ask AI to plan and execute something on the page.",
  ["MODULE" /* MODULE */]: "A list of steps that can be reused in multiple tests.",
  ["AI_ASSERTION" /* AI_ASSERTION */]: "Ask AI whether something is true on the page.",
  ["CLICK" /* CLICK */]: "Click on an element on the page based on a description.",
  ["HOVER" /* HOVER */]: "Hover over an element on the page based on a description.",
  ["SELECT_OPTION" /* SELECT_OPTION */]: "Select an option from a dropdown based on a description.",
  ["TYPE" /* TYPE */]: "Type the specified text into an element.",
  ["PRESS" /* PRESS */]: "Press the specified keys using the keyboard. (e.g. Ctrl+A)",
  ["NAVIGATE" /* NAVIGATE */]: "Navigate to the specified URL.",
  ["SCROLL_UP" /* SCROLL_UP */]: "Scroll up one page.",
  ["SCROLL_DOWN" /* SCROLL_DOWN */]: "Scroll down one page.",
  ["GO_BACK" /* GO_BACK */]: "Go back in browser history.",
  ["GO_FORWARD" /* GO_FORWARD */]: "Go forward in browser history.",
  ["WAIT" /* WAIT */]: "Wait for the specified number of seconds.",
  ["REFRESH" /* REFRESH */]: "Refresh the page. This will not clear cookies or session data.",
  ["TAB" /* TAB */]: "Switch to different tab in the browser.",
  ["COOKIE" /* COOKIE */]: "Set a cookie that will persist throughout the browser session",
  ["SUCCESS" /* SUCCESS */]: "Indicate the entire AI action has succeeded, optionally based on a condition."
};

// ../../packages/types/src/command-results.ts
import * as z6 from "zod";
var ResultStatus = /* @__PURE__ */ ((ResultStatus2) => {
  ResultStatus2["SUCCESS"] = "SUCCESS";
  ResultStatus2["FAILED"] = "FAILED";
  ResultStatus2["RUNNING"] = "RUNNING";
  ResultStatus2["IDLE"] = "IDLE";
  ResultStatus2["CANCELLED"] = "CANCELLED";
  return ResultStatus2;
})(ResultStatus || {});
var CommandStatus = /* @__PURE__ */ ((CommandStatus2) => {
  CommandStatus2["SUCCESS"] = "SUCCESS";
  CommandStatus2["FAILED"] = "FAILED";
  return CommandStatus2;
})(CommandStatus || {});
var CommandMetadataSchema = z6.object({
  beforeUrl: z6.string(),
  // FIXME: this should be a discriminated union of string | Buffer
  // but to avoid too much schema wranging we leave this for now
  // https://github.com/colinhacks/zod/issues/153
  beforeScreenshot: z6.string().or(z6.instanceof(Buffer)),
  afterUrl: z6.string().optional(),
  afterScreenshot: z6.string().or(z6.instanceof(Buffer)).optional(),
  startedAt: z6.coerce.date(),
  finishedAt: z6.coerce.date(),
  viewport: z6.object({
    height: z6.number(),
    width: z6.number()
  }),
  status: z6.nativeEnum(CommandStatus),
  // used for error message and thoughts
  message: z6.string().optional(),
  elementInteracted: z6.string().optional()
});
var StepResultMetadataSchema = z6.object({
  startedAt: z6.coerce.date(),
  finishedAt: z6.coerce.date(),
  status: z6.nativeEnum(ResultStatus),
  // used for error message and thoughts
  message: z6.string().optional(),
  // browser info
  userAgent: z6.string().optional()
});
var PresetActionResultSchema = PresetActionSchema.merge(
  StepResultMetadataSchema
).merge(
  z6.object({
    // Array just for consistency with other result types, should only ever be one for preset.
    results: CommandMetadataSchema.array()
  })
);
var AIActionResultSchema = AIActionSchema.merge(
  StepResultMetadataSchema
).merge(
  z6.object({
    results: PresetActionResultSchema.array()
  })
);
var ModuleResultSchema = ModuleStepSchema.merge(
  StepResultMetadataSchema
).merge(
  z6.object({
    // nested results
    results: z6.union([AIActionResultSchema, PresetActionResultSchema]).array()
  })
);
var ResultSchema = z6.discriminatedUnion("type", [
  AIActionResultSchema,
  PresetActionResultSchema,
  ModuleResultSchema
]);

// ../../packages/types/src/command-serialization.ts
function clampText(text, length) {
  if (text.length < length) {
    return text;
  }
  return text.slice(0, length - 3) + "[...]";
}
function serializeCommand(command) {
  var _a, _b, _c;
  switch (command.type) {
    case "SUCCESS" /* SUCCESS */:
      if ((_a = command.condition) == null ? void 0 : _a.assertion) {
        return `Check success condition: ${command.condition.assertion}`;
      }
      return `All commands completed`;
    case "NAVIGATE" /* NAVIGATE */:
      return `Go to URL: ${clampText(command.url, 30)}`;
    case "GO_BACK" /* GO_BACK */:
      return `Go back to the previous page`;
    case "GO_FORWARD" /* GO_FORWARD */:
      return `Go forward to the next page`;
    case "SCROLL_DOWN" /* SCROLL_DOWN */:
      return `Scroll down one page`;
    case "SCROLL_UP" /* SCROLL_UP */:
      return `Scroll up one page`;
    case "WAIT" /* WAIT */:
      return `Wait for ${command.delay} seconds`;
    case "REFRESH" /* REFRESH */:
      return `Refresh the page`;
    case "CLICK" /* CLICK */:
      return `Click on '${command.target.elementDescriptor}'`;
    case "TYPE" /* TYPE */: {
      let serializedTarget = "";
      if ((_b = command.target.a11yData) == null ? void 0 : _b.serializedForm) {
        serializedTarget = ` in element ${command.target.a11yData.serializedForm}`;
      } else if (command.target.elementDescriptor.length > 0) {
        serializedTarget = ` in element ${command.target.elementDescriptor}`;
      }
      return `Type${serializedTarget}: '${command.value}'`;
    }
    case "HOVER" /* HOVER */: {
      let serializedTarget = "";
      if ((_c = command.target.a11yData) == null ? void 0 : _c.serializedForm) {
        serializedTarget = ` over element: ${command.target.a11yData.serializedForm}`;
      } else if (command.target.elementDescriptor.length > 0) {
        serializedTarget = ` over element: ${command.target.elementDescriptor}`;
      }
      return `Hover${serializedTarget}`;
    }
    case "PRESS" /* PRESS */:
      return `Press '${command.value}'`;
    case "SELECT_OPTION" /* SELECT_OPTION */:
      return `Select option '${command.option}' in '${command.target.elementDescriptor}'`;
    case "TAB" /* TAB */:
      return `Switch to tab: ${command.url}`;
    case "COOKIE" /* COOKIE */:
      return `Set cookie: ${command.value}`;
    case "AI_ASSERTION" /* AI_ASSERTION */:
      return `${command.useVision ? "Visual assertion" : "Assertion"}: '${command.assertion}'`;
    default:
      const assertUnreachable = (_x) => {
        throw "If Typescript complains about the line below, you missed a case or break in the switch above";
      };
      return assertUnreachable(command);
  }
}

// ../../packages/types/src/context.ts
import * as z8 from "zod";

// ../../packages/types/src/execute-results.ts
import * as z7 from "zod";
var ExecuteCommandHistoryEntrySchema = z7.object({
  // type of command executed
  type: z7.nativeEnum(StepType),
  // if AI step type, what command was executed
  generatedStep: UserEditableAICommandSchema.optional(),
  // human readable descriptor for action taken, including element interacted with
  serializedCommand: z7.string().optional(),
  // human readable descriptor for element interacted with
  elementInteracted: z7.string().optional()
});

// ../../packages/types/src/context.ts
var DynamicContextSchema = z8.object({
  // user goal or instruction
  goal: z8.string(),
  // current url of the browser
  url: z8.string(),
  // serialized page state
  browserState: z8.string(),
  // serialized history of previous commands
  history: z8.string(),
  // number of previously executed commands
  numPrevious: z8.number(),
  // last executed command, if any
  lastCommand: ExecuteCommandHistoryEntrySchema.or(z8.null())
});

// ../../packages/types/src/cookies.ts
import { parseString } from "set-cookie-parser";
function parseCookieString(cookie) {
  const parsedCookie = parseString(cookie);
  if (!parsedCookie.name) {
    throw new Error("Name missing from cookie");
  }
  if (!parsedCookie.value) {
    throw new Error("Value missing from cookie");
  }
  let sameSite;
  if (parsedCookie.sameSite) {
    const sameSiteSetting = parsedCookie.sameSite.trim().toLowerCase();
    if (sameSiteSetting === "strict") {
      sameSite = "Strict";
    } else if (sameSiteSetting === "lax") {
      sameSite = "Lax";
    } else if (sameSiteSetting === "none") {
      sameSite = "None";
    } else {
      throw new Error(`Invalid sameSite setting in cookie: ${sameSiteSetting}`);
    }
  }
  if (!parsedCookie.path && parsedCookie.domain) {
    parsedCookie.path = "/";
  }
  const result = __spreadProps(__spreadValues({}, parsedCookie), {
    expires: parsedCookie.expires ? parsedCookie.expires.getTime() / 1e3 : void 0,
    sameSite
  });
  return result;
}

// ../../packages/types/src/goal-splitter.ts
import { z as z9 } from "zod";
var InstructionsSchema = z9.string().array();

// ../../packages/types/src/locator.ts
import * as z10 from "zod";
var AILocatorSchema = z10.object({
  thoughts: z10.string(),
  // a11y id
  id: z10.number().int(),
  // dropdowns should have options
  options: z10.array(z10.string()).optional()
});

// ../../packages/types/src/logger.ts
var LogLevelTags = {
  [0 /* DEBUG */]: "DEBUG",
  [1 /* INFO */]: "INFO",
  [2 /* WARN */]: "WARN",
  [3 /* ERROR */]: "ERROR"
};
var LogLevelColors = {
  [0 /* DEBUG */]: "\x1B[90m",
  [1 /* INFO */]: "\x1B[32m",
  [2 /* WARN */]: "\x1B[33m",
  [3 /* ERROR */]: "\x1B[31m"
};
var ConsoleLogger = class _ConsoleLogger {
  constructor(minLevel, bindings) {
    this.minLogLevel = minLevel;
    this.logBindings = bindings;
  }
  log(level, ...args) {
    const levelName = LogLevelTags[level];
    let objectArg;
    if (Array.isArray(args[0])) {
      objectArg = args[0];
      args = args.slice(1);
    } else if (typeof args[0] === "object") {
      objectArg = __spreadValues(__spreadValues({}, args[0]), this.logBindings);
      args = args.slice(1);
    }
    const colorSequence = LogLevelColors[level];
    const logTokens = [
      `${colorSequence}[${(/* @__PURE__ */ new Date()).toTimeString().slice(0, 8)}][${levelName}]`
    ];
    if (level !== 0 /* DEBUG */) {
      logTokens.push("\x1B[39m");
    }
    logTokens.push(...args);
    console.log(...logTokens);
    if (objectArg && !Array.isArray(objectArg)) {
      for (const [key, value] of Object.entries(objectArg)) {
        let stringifiedValue = value;
        if (typeof value === "object") {
          stringifiedValue = JSON.stringify(value, void 0, 2);
          stringifiedValue = stringifiedValue.split("\n").map(
            (line, index) => index > 0 ? `  ${line}` : line
          ).join("\n");
        }
        console.log(
          level === 0 /* DEBUG */ ? `${colorSequence}  ${key}:` : `  ${key}:`,
          stringifiedValue
        );
      }
    } else if (objectArg) {
      for (const value of objectArg) {
        let stringifiedValue = value;
        if (typeof value === "object") {
          stringifiedValue = JSON.stringify(value, void 0, 2);
          stringifiedValue = stringifiedValue.split("\n").map(
            (line, index) => index > 0 ? `  ${line}` : line
          ).join("\n");
        }
        console.log(
          level === 0 /* DEBUG */ ? `${colorSequence}  ` : `  `,
          stringifiedValue
        );
      }
    }
    if (level === 0 /* DEBUG */) {
      process.stdout.write("\x1B[39m");
    }
  }
  setMinLevel(level) {
    this.minLogLevel = level;
  }
  info(...args) {
    if (1 /* INFO */ < this.minLogLevel) {
      return;
    }
    this.log(1 /* INFO */, ...args);
  }
  debug(...args) {
    if (0 /* DEBUG */ < this.minLogLevel) {
      return;
    }
    this.log(0 /* DEBUG */, ...args);
  }
  warn(...args) {
    if (2 /* WARN */ < this.minLogLevel) {
      return;
    }
    this.log(2 /* WARN */, ...args);
  }
  error(...args) {
    if (3 /* ERROR */ < this.minLogLevel) {
      return;
    }
    this.log(3 /* ERROR */, ...args);
  }
  child(bindings) {
    return new _ConsoleLogger(this.minLogLevel, __spreadValues(__spreadValues({}, this.logBindings), bindings));
  }
  flush() {
    return;
  }
  bindings() {
    return this.logBindings;
  }
};
var consoleLogger = new ConsoleLogger(1 /* INFO */, {});

// ../../packages/types/src/modules.ts
import { z as z11 } from "zod";
var ModuleMetadataSchema = z11.object({
  id: z11.string(),
  createdAt: z11.coerce.date(),
  createdBy: z11.string(),
  organizationId: z11.string(),
  name: z11.string(),
  schemaVersion: z11.string(),
  // this is only used in the client and is not stored in the db
  numSteps: z11.number()
});
var ModuleSchema = z11.object({
  steps: AllowedModuleStepSchema.array()
}).merge(ModuleMetadataSchema.omit({ numSteps: true }));

// ../../packages/types/src/public-api.ts
import * as z15 from "zod";

// ../../packages/types/src/runs.ts
import { z as z12 } from "zod";
var RunTriggerEnum = {
  WEBHOOK: "WEBHOOK",
  CRON: "CRON",
  MANUAL: "MANUAL",
  CLI: "CLI"
};
var RunStatusEnum = {
  PENDING: "PENDING",
  RUNNING: "RUNNING",
  PASSED: "PASSED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED"
};
var DateOrStringSchema = z12.string().pipe(z12.coerce.date()).or(z12.date());
var RunMetadataSchema = z12.object({
  id: z12.string(),
  createdAt: DateOrStringSchema,
  createdBy: z12.string(),
  organizationId: z12.string(),
  scheduledAt: DateOrStringSchema.or(z12.null()),
  startedAt: DateOrStringSchema.or(z12.null()),
  finishedAt: DateOrStringSchema.or(z12.null()),
  testId: z12.string().or(z12.null()),
  status: z12.nativeEnum(RunStatusEnum),
  trigger: z12.nativeEnum(RunTriggerEnum),
  attempts: z12.number(),
  test: z12.object({
    name: z12.string(),
    id: z12.string()
  }).or(z12.null())
});
var RunWithTestSchema = RunMetadataSchema.merge(
  z12.object({
    results: ResultSchema.array(),
    test: z12.object({
      name: z12.string(),
      id: z12.string(),
      baseUrl: z12.string()
    }).or(z12.null())
  })
);

// ../../packages/types/src/test.ts
import { z as z14 } from "zod";

// ../../packages/types/src/test-settings.ts
import { isValidCron } from "cron-validator";
import { z as z13 } from "zod";
var TestAdvancedSettingsSchema = z13.object({
  availableAsModule: z13.boolean().default(false),
  disableAICaching: z13.boolean().default(false)
});
var ScheduleSettingsSchema = z13.object({
  cron: z13.string().refine(
    (v) => {
      return isValidCron(v);
    },
    { message: "Invalid cron expression." }
  ).default("0 0 */1 * *"),
  enabled: z13.boolean().default(false),
  timeZone: z13.string().default("America/Los_Angeles"),
  // this is used for removing repeatable jobs (not set by user)
  jobKey: z13.string().optional()
});
var NotificationSettingsSchema = z13.object({
  onSuccess: z13.boolean().default(false),
  onFailure: z13.boolean().default(true)
});

// ../../packages/types/src/test.ts
var TestNameSchema = z14.string().min(1).max(255).superRefine((v, ctx) => {
  try {
    validateTestOrModuleName(v);
  } catch (err) {
    ctx.addIssue({
      code: z14.ZodIssueCode.custom,
      message: err.message,
      fatal: true
    });
    return z14.NEVER;
  }
});
var BaseTestMetadataSchema = z14.object({
  id: z14.string(),
  name: TestNameSchema,
  baseUrl: z14.string(),
  schemaVersion: z14.string(),
  advanced: TestAdvancedSettingsSchema,
  retries: z14.number()
});
var UserEditableTestSettingsSchema = BaseTestMetadataSchema.pick({
  name: true,
  baseUrl: true,
  retries: true,
  advanced: true
});
var ExtendedTestMetadataSchema = z14.object({
  createdAt: z14.coerce.date(),
  updatedAt: z14.coerce.date(),
  schedule: ScheduleSettingsSchema,
  notification: NotificationSettingsSchema,
  createdBy: z14.string(),
  organizationId: z14.string()
});
var ResolvedTestSchema = BaseTestMetadataSchema.merge(
  ExtendedTestMetadataSchema
).merge(
  z14.object({
    steps: z14.array(ResolvedStepSchema)
  })
);
var MinimalRunnableResolvedTestSchema = BaseTestMetadataSchema.merge(
  z14.object({
    steps: z14.array(ResolvedStepSchema)
  })
);
var UUID_REGEX = /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;
function validateTestOrModuleName(name) {
  name = name.toLowerCase();
  if (name.length === 0 || name.length > 255) {
    throw new Error("Name must be between 1 and 255 characters long");
  }
  const invalidChars = /[<>:"\/\\|?*\x00]/;
  if (invalidChars.test(name)) {
    throw new Error(
      "Name can only contain alphanumeric characters, dashes, and underscores."
    );
  }
  const windowsReservedNames = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
  if (windowsReservedNames.test(name)) {
    throw new Error(
      `"${name}" is a reserved name on Windows and cannot be used as a filename.`
    );
  }
  if (/^\.+$/.test(name) || /^\s|\s$/.test(name)) {
    throw new Error("Name cannot start or end with a space or dot.");
  }
  if (name.endsWith(".yaml")) {
    throw new Error('Name cannot end with ".yaml".');
  }
  if (name === "modules") {
    throw new Error(
      "'modules' is a reserved folder name in Momentic. Please choose a different name."
    );
  }
  if (name.match(UUID_REGEX)) {
    throw new Error("Name cannot be a UUID. Please choose a different name.");
  }
}

// ../../packages/types/src/public-api.ts
var GeneratorOptionsSchema = z15.object({
  disableCache: z15.boolean()
});
var GetNextCommandBodySchema = DynamicContextSchema.merge(
  GeneratorOptionsSchema
);
var GetNextCommandResponseSchema = AICommandSchema;
var GetAssertionResultBodySchema = z15.discriminatedUnion("vision", [
  DynamicContextSchema.merge(GeneratorOptionsSchema).merge(
    z15.object({
      vision: z15.literal(false)
    })
  ),
  DynamicContextSchema.pick({
    goal: true,
    url: true
  }).merge(GeneratorOptionsSchema).merge(
    z15.object({
      // base64 encoded image
      screenshot: z15.string(),
      vision: z15.literal(true)
    })
  )
]);
var GetAssertionResponseSchema = AIAssertionResultSchema;
var LocateBodySchema = DynamicContextSchema.pick({
  browserState: true,
  goal: true
}).merge(GeneratorOptionsSchema);
var LocateResponseSchema = AILocatorSchema;
var SplitGoalBodySchema = DynamicContextSchema.pick({
  goal: true,
  url: true
}).merge(GeneratorOptionsSchema);
var SplitGoalResponseSchema = z15.string().array();
var QueueTestsBodySchema = z15.union([
  z15.object({
    testPaths: z15.string().array(),
    all: z15.boolean().optional()
  }),
  z15.object({
    testIds: z15.string().array()
  }).describe("deprecated - for backwards compatibility only")
]);
var QueueTestsResponseSchema = z15.object({
  message: z15.string(),
  queuedTests: z15.object({
    name: z15.string(),
    id: z15.string()
  }).array()
});
var GetAllTestIdsResponseSchema = z15.string().array();
var ExportTestBodySchema = z15.union([
  z15.object({
    paths: z15.string().array().describe("run specific test paths (e.g. todo-test)")
  }),
  z15.object({
    path: z15.string().describe("deprecated; present for backcompat")
  }),
  z15.object({
    all: z15.boolean().describe("run all tests")
  })
]);
var ExportTestResponseSchema = z15.object({
  tests: z15.record(
    z15.string().describe("Test name"),
    z15.string().describe("Test YAML")
  ),
  modules: z15.record(
    z15.string().describe("Module name"),
    z15.string().describe("Module YAML")
  )
});
var TestWithModulesYAMLSchema = z15.object({
  test: z15.string().describe("test YAML"),
  modules: z15.record(
    z15.string().describe("moduleId"),
    z15.string().describe("module YAML")
  )
});
var UpdateTestsBodySchema = TestWithModulesYAMLSchema.array();
var CreateRunBodySchema = z15.object({
  testPath: z15.string(),
  testId: z15.string()
}).partial().merge(
  z15.object({
    trigger: z15.nativeEnum(RunTriggerEnum)
  })
);
var UpdateRunBodySchema = z15.object({
  startedAt: z15.coerce.date(),
  finishedAt: z15.coerce.date(),
  results: ResultSchema.array(),
  status: z15.nativeEnum(RunStatusEnum)
}).partial();
var CreateScreenshotBodySchema = z15.object({
  // base64 string
  screenshot: z15.string()
});
var CreateScreenshotResponseSchema = z15.object({
  key: z15.string()
});

// ../../packages/types/src/test-serialization.ts
import { stringify } from "yaml";
import { z as z16 } from "zod";
var TestSerializationResultSchema = z16.object({
  test: z16.string().describe("YAML for the test, including metadata and steps"),
  modules: z16.record(z16.string(), z16.string()).describe("Map of module name to YAML for the module")
});
var SerializedTestSchema = BaseTestMetadataSchema.merge(
  z16.object({
    steps: StepSchema.array(),
    fileType: z16.literal("momentic/test" /* TEST */)
  })
);
var SerializedModuleSchema = ResolvedModuleStepSchema.omit({
  type: true
}).merge(
  z16.object({
    schemaVersion: z16.string(),
    fileType: z16.literal("momentic/module")
  })
);
var DeserializedTestSchema = BaseTestMetadataSchema.merge(
  z16.object({
    steps: z16.array(z16.record(z16.string(), z16.unknown()))
  })
);
var DeserializedModuleSchema = z16.object({
  moduleId: z16.string().uuid(),
  name: z16.string(),
  schemaVersion: z16.string(),
  steps: z16.array(z16.record(z16.string(), z16.unknown()))
});

// ../../packages/web-agent/src/utils/url.ts
var urlChanged = (url1, url2) => {
  const { hostname, pathname } = new URL(url1);
  const { hostname: hostname2, pathname: pathname2 } = new URL(url2);
  return hostname !== hostname2 || pathname !== pathname2;
};

// ../../packages/web-agent/src/browsers/a11y.ts
import { distance } from "fastest-levenshtein";

// ../../packages/web-agent/src/browsers/constants.ts
var RETINA_WINDOW_SCALE_FACTOR = 2;
var MAX_LOAD_TIMEOUT_MS = 8e3;
var NETWORK_STABLE_DURATION_MS = 1250;
var NETWORK_IDLE_TIMEOUT_MS = 3e3;
var CHECK_INTERVAL_MS = 250;
var A11Y_LOAD_TIMEOUT_MS = 1e3;
var A11Y_STABLE_TIMEOUT_MS = NETWORK_IDLE_TIMEOUT_MS;
var A11Y_STABLE_DURATION_MS = NETWORK_STABLE_DURATION_MS;
var BROWSER_ACTION_TIMEOUT_MS = MAX_LOAD_TIMEOUT_MS;
var COMPLICATED_BROWSER_ACTION_TIMEOUT_MS = MAX_LOAD_TIMEOUT_MS;
var HIGHLIGHT_DURATION_MS = 3e3;
var MAX_LEVENSHTEIN_DISTANCE = 300;
var MAX_LEVENSHTEIN_CHANGE_RATIO = 0.2;
var MAX_LEVENSHTEIN_FIELD_CHANGE_RATIO = 0.1;
var MIN_SIMILARITY_SCORE_TO_REUSE = 5;
var CHROME_INTERNAL_URLS = /* @__PURE__ */ new Set([
  "about:blank",
  "chrome-error://chromewebdata/"
]);
var MAX_BROWSER_ACTION_ATTEMPTS = 2;

// ../../packages/web-agent/src/browsers/a11y.ts
var bannedProperties = /* @__PURE__ */ new Set(["focusable"]);
var alwaysInterestingRoles = /* @__PURE__ */ new Set([
  "textbox",
  "checkbox",
  "combobox",
  "button",
  "link",
  "combobox"
]);
var rolesToOmitID = /* @__PURE__ */ new Set(["paragraph", "option"]);
var defaultA11yNodeSerializeParams = {
  indentLevel: 0,
  noID: false,
  noChildren: false,
  noProperties: false,
  maxLevel: void 0,
  neighbors: void 0
};
var ProcessedA11yNode = class {
  constructor(params) {
    this.id = params.id;
    this.role = params.role;
    this.name = params.name;
    this.content = params.content;
    this.properties = params.properties;
    this.pathFromRoot = params.pathFromRoot;
    this.children = params.children;
    this.backendNodeID = params.backendNodeID;
  }
  getLogForm() {
    var _a, _b;
    return JSON.stringify({
      id: this.id,
      name: (_a = this.name) != null ? _a : "",
      role: (_b = this.role) != null ? _b : "",
      backendNodeId: this.backendNodeID
    });
  }
  /**
   * Returns true if the current node contains interesting properties.
   * Does not go through children.
   */
  isInteresting() {
    if (alwaysInterestingRoles.has(this.role))
      return true;
    if (this.children.some((child) => child.role === "StaticText"))
      return true;
    return !!this.name.trim() || !!this.content;
  }
  serialize(opts = defaultA11yNodeSerializeParams) {
    var _a, _b;
    const { indentLevel, noChildren, noProperties, noID } = Object.assign(
      {},
      defaultA11yNodeSerializeParams,
      opts
    );
    const indent = " ".repeat(indentLevel);
    if (this.role === "StaticText") {
      return `${indent}${this.name}
`;
    }
    let s = `${indent}<${this.role}`;
    if (!noID && !rolesToOmitID.has(this.role)) {
      s += ` id="${this.id}"`;
    }
    if (this.name) {
      s += ` name="${this.name}"`;
    }
    if (this.content) {
      s += ` content="${this.content}"`;
    }
    if (Object.keys(this.properties).length > 0 && !noProperties) {
      Object.entries(this.properties).forEach(([k, v]) => {
        if (bannedProperties.has(k)) {
          return;
        } else if (typeof v === "string") {
          s += ` ${k}="${v}"`;
        } else if (typeof v === "boolean") {
          if (v) {
            s += ` ${k}`;
          } else {
            s += ` ${k}={false}`;
          }
        } else if (typeof v !== "undefined") {
          s += ` ${k}={${JSON.stringify(v)}}`;
        }
      });
    }
    const maxLevelExceeded = opts.maxLevel !== void 0 && indentLevel / 2 >= opts.maxLevel;
    if (this.children.length === 0 || noChildren || maxLevelExceeded) {
      s += " />\n";
      return s;
    } else {
      s += ">\n";
      for (const child of this.children) {
        s += child.serialize(__spreadProps(__spreadValues({}, opts), { indentLevel: indentLevel + 2 }));
      }
      s += `${indent}</${this.role}>
`;
    }
    if (opts.neighbors !== void 0 && opts.neighbors > 0 && this.parent) {
      const currentIndex = this.parent.children.findIndex(
        (n) => n.id === this.id
      );
      const before = currentIndex > 0 ? (_a = this.parent.children[currentIndex - 1]) == null ? void 0 : _a.serialize(__spreadProps(__spreadValues({}, opts), {
        neighbors: 0
      })) : "";
      const after = currentIndex < this.parent.children.length - 1 ? (_b = this.parent.children[currentIndex + 1]) == null ? void 0 : _b.serialize(__spreadProps(__spreadValues({}, opts), {
        neighbors: 0
      })) : "";
      return `${before ? before : ""}
${s}
${after ? after : ""}`;
    }
    return s;
  }
};
var ProcessedA11yTree = class {
  constructor(root, nodeMap) {
    this.root = root;
    this.nodeMap = nodeMap;
  }
  serialize() {
    if (!this.root) {
      return "";
    }
    return this.root.serialize();
  }
  // public diff(other: ProcessedA11yTree): string[] {
  //   const results: string[] = [];
  // }
};
function getNodePathIdentifier(node) {
  var _a, _b;
  if ((_a = node.name) == null ? void 0 : _a.value) {
    return `"${node.name.value}"`;
  }
  if (((_b = node.role) == null ? void 0 : _b.value) && node.role.value !== "none" && node.role.value !== "generic") {
    return `"${node.role.value}"`;
  }
  return `"${node.nodeId}"`;
}
function processA11yTreeDFS(node, parent, inputNodeMap, outputNodeMap) {
  var _a, _b, _c, _d, _e, _f, _g;
  if (!parent && node.parentId) {
    throw new Error(
      `Got no parent for accessibility node ${node.nodeId}: ${JSON.stringify(
        node
      )}`
    );
  }
  const processedNode = new ProcessedA11yNode({
    id: node.nodeId,
    role: ((_a = node.role) == null ? void 0 : _a.value) || "",
    name: ((_b = node.name) == null ? void 0 : _b.value) || "",
    content: ((_c = node.value) == null ? void 0 : _c.value) || "",
    properties: {},
    children: [],
    pathFromRoot: (parent ? `${parent.pathFromRoot} ` : "") + getNodePathIdentifier(node),
    backendNodeID: node.backendDOMNodeId
    // md5Sum: "",
  });
  if ((_d = node.value) == null ? void 0 : _d.value) {
    processedNode.content = `${(_e = node.value) == null ? void 0 : _e.value}`;
  }
  if (node.properties) {
    node.properties.forEach((prop) => {
      processedNode.properties[prop.name] = prop.value.value;
    });
  }
  outputNodeMap.set(processedNode.id, processedNode);
  const children = (_f = node.childIds) != null ? _f : [];
  for (const childId of children) {
    if (!childId) {
      continue;
    }
    const child = inputNodeMap.get(childId);
    if (!child) {
      continue;
    }
    const processedChildren = processA11yTreeDFS(
      child,
      processedNode,
      inputNodeMap,
      outputNodeMap
    );
    if (!processedChildren.length) {
      continue;
    }
    processedNode.children = processedNode.children.concat(processedChildren);
  }
  if (processedNode.role === "StaticText") {
    processedNode.children = [];
  }
  if (processedNode.children.length === 1 && processedNode.children[0].role === "StaticText") {
    const currentName = processedNode.name;
    const childName = (_g = processedNode.children[0]) == null ? void 0 : _g.name;
    if (currentName === childName || !childName) {
      processedNode.children = [];
    }
  }
  const staticTextGroupedChildren = [];
  for (let i = processedNode.children.length - 1; i >= 0; i--) {
    const node2 = processedNode.children[i];
    if (node2.role !== "StaticText") {
      staticTextGroupedChildren.push(node2);
      continue;
    }
    if (i === 0 || processedNode.children[i - 1].role !== "StaticText") {
      staticTextGroupedChildren.push(node2);
      continue;
    }
    processedNode.children[i - 1].name += ` ${node2.name}`;
  }
  processedNode.children = staticTextGroupedChildren.reverse();
  for (const child of processedNode.children) {
    child.parent = processedNode;
  }
  const interesting = processedNode.isInteresting();
  if (!interesting) {
    if (processedNode.children.length === 0) {
      return [];
    } else if (processedNode.children.length === 1) {
      return [processedNode.children[0]];
    } else if (node.parentId) {
      return processedNode.children;
    }
  }
  return [processedNode];
}
function processA11yTree(graph) {
  if (!graph.root) {
    throw new Error("a11y tree has null root");
  }
  graph.allNodes = graph.allNodes.filter((node) => {
    var _a;
    if (!node.ignored) {
      return true;
    }
    return !((_a = node.ignoredReasons) == null ? void 0 : _a.find(
      (reason) => {
        var _a2;
        return reason.name === "notRendered" && ((_a2 = reason.value) == null ? void 0 : _a2.value);
      }
    ));
  });
  const nodeMap = /* @__PURE__ */ new Map();
  for (const node of graph.allNodes) {
    nodeMap.set(node.nodeId, node);
  }
  const outputNodeMap = /* @__PURE__ */ new Map();
  const processedRoot = processA11yTreeDFS(
    graph.root,
    null,
    nodeMap,
    outputNodeMap
  );
  if (processedRoot.length > 1) {
    throw new Error(
      `Something went horribly wrong processing the a11y tree, we got: ${JSON.stringify(
        processedRoot
      )}`
    );
  } else if (processedRoot.length === 0) {
    throw new EmptyA11yTreeError();
  }
  return new ProcessedA11yTree(processedRoot[0], outputNodeMap);
}
var saveNodeDetailsToCache = (node, target) => {
  target.id = parseInt(node.id);
  target.content = node.content;
  target.name = node.name;
  target.role = node.role;
  target.numChildren = node.children.length;
  target.serializedForm = node.serialize({
    noID: true,
    maxLevel: 1,
    neighbors: 1
    // only 1 neighbor is supported right now
  });
};
var getNodeComparisonScore = (node, target) => {
  var _a;
  let score = 1;
  if (node.role === target.role) {
    score++;
  }
  const attrs = ["name", "content"];
  for (const attr of attrs) {
    if (!((_a = node[attr]) == null ? void 0 : _a.trim())) {
      continue;
    }
    const fieldChangeRatio = distance(node[attr], target[attr]) / Math.min(node[attr].length, target[attr].length);
    if (fieldChangeRatio === 0) {
      score += 2;
    } else if (fieldChangeRatio <= MAX_LEVENSHTEIN_FIELD_CHANGE_RATIO) {
      score++;
    }
  }
  if (target.numChildren !== void 0) {
    if (node.children.length === target.numChildren && target.numChildren > 0) {
      score++;
    } else if (target.numChildren > 0 && node.children.length === 0) {
      score--;
    } else if (Math.abs(node.children.length - target.numChildren) > 2) {
      score--;
    }
  }
  if (target.serializedForm) {
    const serializedNode = node.serialize({
      noID: true,
      maxLevel: 1,
      neighbors: 1
    });
    const levenshteinRatio = distance(serializedNode, target.serializedForm) / Math.min(serializedNode.length, target.serializedForm.length);
    if (levenshteinRatio === 0) {
      score += 2;
    } else if (levenshteinRatio <= MAX_LEVENSHTEIN_FIELD_CHANGE_RATIO) {
      score++;
    }
  }
  return score;
};

// ../../packages/web-agent/src/browsers/cdp.ts
var GREEN = { r: 147, g: 196, b: 125, a: 0.55 };
var NODE_HIGHLIGHT_CONFIG = {
  showInfo: false,
  showRulers: false,
  showStyles: false,
  showAccessibilityInfo: false,
  showExtensionLines: false,
  contrastAlgorithm: "aa",
  contentColor: GREEN,
  paddingColor: GREEN,
  borderColor: GREEN,
  marginColor: GREEN,
  eventTargetColor: GREEN,
  shapeColor: GREEN,
  shapeMarginColor: GREEN
};

// ../../packages/web-agent/src/browsers/utils/time.ts
var sleep = (ms = 1e3) => {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
};

// ../../packages/web-agent/src/browsers/utils/scripts/cursor.ts
function addCursorScript() {
  cursor = document.createElement("img");
  cursor.setAttribute(
    "src",
    "data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjMyIiB2aWV3Qm94PSIwIDAgMzIgMzIiIHdpZHRoPSIzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEwIDcpIj48cGF0aCBkPSJtNi4xNDggMTguNDczIDEuODYzLTEuMDAzIDEuNjE1LS44MzktMi41NjgtNC44MTZoNC4zMzJsLTExLjM3OS0xMS40MDh2MTYuMDE1bDMuMzE2LTMuMjIxeiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Im02LjQzMSAxNyAxLjc2NS0uOTQxLTIuNzc1LTUuMjAyaDMuNjA0bC04LjAyNS04LjA0M3YxMS4xODhsMi41My0yLjQ0MnoiIGZpbGw9IiMwMDAiLz48L2c+PC9zdmc+"
  );
  cursor.setAttribute("id", "selenium_cursor");
  cursor.setAttribute(
    "style",
    "position: absolute; z-index: 99999999999; pointer-events: none; left:0; top:0"
  );
  cursor.style.filter = "invert(0%) sepia(6%) saturate(24%) hue-rotate(315deg) brightness(89%) contrast(110%)";
  document.body.appendChild(cursor);
  document.onmousemove = function(e) {
    e = e || window.event;
    document.getElementById("selenium_cursor").style.left = e.pageX + "px";
    document.getElementById("selenium_cursor").style.top = e.pageY + "px";
  };
}

// ../../packages/web-agent/src/browsers/utils/scripts/addIDs.ts
function addIDsScript() {
  const allElements = document.getElementsByTagName("*");
  let currentID = 1;
  for (let i = 0; i < allElements.length; i++) {
    const element = allElements[i];
    element == null ? void 0 : element.setAttribute("data-momentic-id", currentID);
    currentID++;
  }
}

// ../../packages/web-agent/src/browsers/utils/playwright.ts
var sometimesRelevantResourceTypes = /* @__PURE__ */ new Set([
  "document",
  "script",
  "XMLHttpRequest",
  "fetch",
  "xhr"
]);
var alwaysRelevantResourceTypes = /* @__PURE__ */ new Set(["script", "document"]);
var bannedDomains = [
  "intercom.io",
  "googletagmanager.com",
  "google-analytics.com",
  "www.gstatic.com",
  "apis.google.com",
  "sentry.io",
  "newrelic.com",
  "p.retool.com",
  "m.stripe.com",
  "m.stripe.network",
  "js.stripe.com",
  "assets.trybento.co",
  "udon.trybento.co",
  "cdn.lr-in-prod.com",
  "r.lr-in-prod.com",
  "content.product-usage.assembledhq.com",
  "data.product-usage.assembledhq.com",
  "static.zdassets.com"
];
function serializeRequest(request) {
  return `${request.resourceType()} ${request.method()} ${request.url()}`;
}
function stripWWWPrefix(url) {
  url = url.replace(/^www\./, "");
  return url;
}
function isRequestRelevantForPageLoad(request, currentURL) {
  if (!sometimesRelevantResourceTypes.has(request.resourceType())) {
    return false;
  }
  const parsedCurrentURL = new URL(currentURL);
  const parsedRequestURL = new URL(request.url());
  if (bannedDomains.some((domain) => parsedRequestURL.hostname.includes(domain))) {
    return false;
  }
  if (alwaysRelevantResourceTypes.has(request.resourceType())) {
    return true;
  }
  if (request.method() !== "GET") {
    return true;
  }
  return stripWWWPrefix(parsedRequestURL.hostname).includes(
    stripWWWPrefix(parsedCurrentURL.hostname)
  );
}

// ../../packages/web-agent/src/browsers/chrome.ts
var chromiumWithExtra = addExtra(chromium);
chromiumWithExtra.use(pluginStealth());
function initCDPSession(cdpClient) {
  return __async(this, null, function* () {
    yield cdpClient.send("Accessibility.enable");
    yield cdpClient.send("DOM.enable");
    yield cdpClient.send("Overlay.enable");
  });
}
var _ChromeBrowser = class _ChromeBrowser {
  constructor({
    browser,
    context,
    page,
    baseURL,
    cdpClient,
    logger
  }) {
    // key is nodeId, according to the a11y tree
    this.nodeMap = /* @__PURE__ */ new Map();
    this.browser = browser;
    this.context = context;
    this.page = page;
    this.baseURL = baseURL;
    this.cdpClient = cdpClient;
    this.logger = logger;
  }
  /**
   * Creates a new browser and waits for navigation to the given test URL.
   */
  static init(_0, _1, _2) {
    return __async(this, arguments, function* (baseURL, logger, onScreenshot, timeout = MAX_LOAD_TIMEOUT_MS) {
      const browser = yield chromiumWithExtra.launch({
        headless: true,
        handleSIGTERM: false
      });
      const context = yield browser.newContext({
        viewport: {
          width: 1920,
          height: 1080
        },
        // comment out the below if you are on Mac OS but you're using a monitor
        deviceScaleFactor: process.platform === "darwin" ? RETINA_WINDOW_SCALE_FACTOR : 1,
        userAgent: devices["Desktop Chrome"].userAgent,
        geolocation: { latitude: 37.7749, longitude: -122.4194 },
        // san francisco
        locale: "en-US",
        timezoneId: "America/Los_Angeles"
      });
      const page = yield context.newPage();
      const cdpClient = yield context.newCDPSession(page);
      const chrome = new _ChromeBrowser({
        browser,
        context,
        page,
        baseURL,
        cdpClient,
        logger
      });
      let completed = false;
      const navigateAndInitCDP = () => __async(this, null, function* () {
        try {
          yield chrome.navigate(baseURL, false);
          yield initCDPSession(cdpClient);
        } catch (err) {
          logger.error({ err }, "Failed to initialize chrome browser");
        } finally {
          completed = true;
        }
      });
      void navigateAndInitCDP();
      const sendScreenshot = () => __async(this, null, function* () {
        if (!onScreenshot) {
          return;
        }
        try {
          onScreenshot({
            viewport: chrome.viewport,
            buffer: yield chrome.screenshot()
          });
        } catch (err) {
          logger.error({ err }, "Failed to take screenshot");
        }
      });
      void sendScreenshot();
      const screenshotInterval = setInterval(() => {
        void sendScreenshot();
      }, 250);
      const startTime = Date.now();
      while (!completed && Date.now() - startTime < timeout) {
        yield sleep(CHECK_INTERVAL_MS);
      }
      clearInterval(screenshotInterval);
      if (!completed) {
        logger.warn(
          "Timeout elapsed waiting for browser to initialize - are you sure this page is accessible?"
        );
      }
      return chrome;
    });
  }
  // Things to do on every page load
  pageSetup() {
    return __async(this, null, function* () {
      yield this.page.evaluate(addCursorScript);
      yield this.page.evaluate(addIDsScript);
    });
  }
  wait(timeoutMs) {
    return __async(this, null, function* () {
      yield this.page.waitForTimeout(timeoutMs);
    });
  }
  cleanup() {
    return __async(this, null, function* () {
      yield this.page.close();
      yield this.context.close();
      yield this.browser.close();
    });
  }
  get closed() {
    return this.page.isClosed() || !this.browser.isConnected();
  }
  html() {
    return __async(this, null, function* () {
      return yield this.page.content();
    });
  }
  get url() {
    return this.page.url();
  }
  screenshot(quality = 100, scale = "device") {
    return __async(this, null, function* () {
      return yield this.page.screenshot({
        fullPage: false,
        quality,
        scale,
        type: "jpeg",
        // allow the blinking text cursor thing to remain there
        caret: "initial"
      });
    });
  }
  get viewport() {
    const viewport = this.page.viewportSize();
    if (!viewport) {
      throw new Error("failed to get viewport");
    }
    return viewport;
  }
  navigate(url, wrapPossibleNavigation = true) {
    return __async(this, null, function* () {
      this.logger.debug(`Navigating to ${url}`);
      const startTime = Date.now();
      const doNav = () => __async(this, null, function* () {
        try {
          yield this.page.goto(url, {
            timeout: MAX_LOAD_TIMEOUT_MS
          });
          this.logger.debug(
            { url },
            `Got load event in ${Math.floor(Date.now() - startTime)}ms`
          );
        } catch (e) {
          this.logger.warn(
            { url, type: "navigate", err: e },
            "Timeout elapsed waiting for page to load, continuing anyways..."
          );
        }
      });
      if (wrapPossibleNavigation) {
        yield this.wrapPossibleNavigation(doNav);
      } else {
        yield doNav();
      }
      if (CHROME_INTERNAL_URLS.has(this.url) && process.env.NODE_ENV === "production") {
        throw new Error(
          `${url} took too long to load \u{1F61E}. Please ensure the site and your internet are working.`
        );
      }
      yield this.pageSetup();
      this.logger.debug({ url }, "Navigation complete");
    });
  }
  fill(_0, _1) {
    return __async(this, arguments, function* (target, text, options = {}) {
      const element = yield this.click(target, {
        doubleClick: false,
        rightClick: false
      });
      yield this.type(text, options);
      return element;
    });
  }
  type(_0) {
    return __async(this, arguments, function* (text, options = {}) {
      const { clearContent = true, pressKeysSequentially = false } = options;
      if (clearContent) {
        if (process.platform === "darwin") {
          yield this.page.keyboard.press("Meta+A");
        } else {
          yield this.page.keyboard.press("Control+A");
        }
        yield this.page.keyboard.press("Backspace");
      }
      if (pressKeysSequentially) {
        yield this.page.keyboard.type(text);
      } else {
        yield this.page.keyboard.insertText(text);
      }
    });
  }
  clickByA11yID(_0) {
    return __async(this, arguments, function* (index, options = {}) {
      const node = this.nodeMap.get(`${index}`);
      if (!node) {
        throw new Error(`Could not find DOM node during click: ${index}`);
      }
      const nodeClicked = yield this.clickUsingCDP(node, options);
      yield this.highlightNode(nodeClicked);
      return node.serialize({ noChildren: true, noProperties: true, noID: true });
    });
  }
  selectOptionByA11yID(index, option) {
    return __async(this, null, function* () {
      const node = this.nodeMap.get(`${index}`);
      if (!node) {
        throw new Error(
          `Could not find DOM node while selecting option: ${index}`
        );
      }
      if (!node.backendNodeID) {
        throw new Error(
          `Select target missing backend node id: ${node.getLogForm()}`
        );
      }
      const locator = yield this.getLocatorFromBackendID(node.backendNodeID);
      yield locator.selectOption(option, {
        timeout: COMPLICATED_BROWSER_ACTION_TIMEOUT_MS
      });
      yield this.highlightNode(node);
      return node.serialize({ noChildren: true, noProperties: true, noID: true });
    });
  }
  scrollIntoView(target) {
    return __async(this, null, function* () {
      const id = yield this.resolveCachedTargetToID(target);
      const node = this.nodeMap.get(`${id}`);
      if (!node) {
        throw new Error(`Could not find node in DOM with a11y id: ${id}`);
      }
      if (!node.backendNodeID) {
        throw new Error(
          `Focus target missing backend node id: ${node.getLogForm()}`
        );
      }
      const locator = yield this.getLocatorFromBackendID(node.backendNodeID);
      yield locator.scrollIntoViewIfNeeded({
        timeout: BROWSER_ACTION_TIMEOUT_MS
      });
    });
  }
  highlight(target) {
    return __async(this, null, function* () {
      try {
        const id = yield this.resolveCachedTargetToID(target);
        const node = this.nodeMap.get(`${id}`);
        if (!node) {
          throw new Error(`Could not find DOM node during highlight: ${id}`);
        }
        if (!node.backendNodeID) {
          throw new Error(
            `Select target missing backend node id: ${node.getLogForm()}`
          );
        }
        yield this.highlightNode(node);
      } catch (err) {
        this.logger.warn({ err, target }, "Failed to highlight target");
      }
    });
  }
  highlightNode(node) {
    return __async(this, null, function* () {
      try {
        yield this.cdpClient.send("Overlay.highlightNode", {
          highlightConfig: NODE_HIGHLIGHT_CONFIG,
          backendNodeId: node.backendNodeID
        });
      } catch (err) {
        this.logger.warn(
          "Failed to add node highlight, a page navigation likely occurred. This is non-fatal for tests."
        );
      }
      const hideHighlight = () => __async(this, null, function* () {
        try {
          yield this.cdpClient.send("Overlay.hideHighlight", {
            backendNodeId: node.backendNodeID
          });
        } catch (err) {
          this.logger.debug({ err }, "Failed to remove node highlight");
        }
      });
      setTimeout(() => {
        void hideHighlight();
      }, HIGHLIGHT_DURATION_MS);
    });
  }
  wrapPossibleNavigation(_0) {
    return __async(this, arguments, function* (fn, timeoutMS = MAX_LOAD_TIMEOUT_MS) {
      const startTime = Date.now();
      const startURL = this.url;
      let lastRequestReceived = Date.now();
      const firedRequests = /* @__PURE__ */ new Map();
      const finishedRequests = /* @__PURE__ */ new Map();
      const requestFinishedListener = (request) => {
        var _a;
        const key = serializeRequest(request);
        finishedRequests.set(key, ((_a = finishedRequests.get(key)) != null ? _a : 0) + 1);
      };
      const requestFiredListener = (request) => {
        var _a;
        if (!isRequestRelevantForPageLoad(request, this.url)) {
          return;
        }
        const key = serializeRequest(request);
        firedRequests.set(key, ((_a = firedRequests.get(key)) != null ? _a : 0) + 1);
        lastRequestReceived = Date.now();
      };
      this.page.on("requestfinished", requestFinishedListener);
      this.page.on("request", requestFiredListener);
      let rejected = false;
      const retPromise = fn().catch((e) => {
        rejected = true;
        if (e instanceof Error)
          return e;
        return new Error(`${e}`);
      });
      yield sleep(CHECK_INTERVAL_MS);
      const unwrapAndThrowError = (p) => __async(this, null, function* () {
        const v = yield p;
        if (v instanceof Error) {
          throw v;
        }
        return v;
      });
      let unfinishedRequests = /* @__PURE__ */ new Set();
      const waitForNetworkIdle = () => __async(this, null, function* () {
        while (!rejected && Date.now() - startTime < timeoutMS) {
          unfinishedRequests = /* @__PURE__ */ new Set();
          yield sleep(CHECK_INTERVAL_MS);
          if (Date.now() - lastRequestReceived <= NETWORK_STABLE_DURATION_MS) {
            continue;
          }
          let anyDifference = false;
          for (const key of firedRequests.keys()) {
            if (firedRequests.get(key) !== finishedRequests.get(key)) {
              anyDifference = true;
              unfinishedRequests.add(key);
            }
          }
          if (!anyDifference) {
            this.logger.debug(
              {
                url: this.url,
                requests: JSON.stringify(Array.from(firedRequests.entries()))
              },
              `Network idle in ${Math.floor(Date.now() - startTime)}ms`
            );
            return true;
          }
        }
        if (!rejected && unfinishedRequests.size > 0) {
          this.logger.warn(
            {
              url: this.url,
              unfinishedRequests: JSON.stringify(
                Array.from(unfinishedRequests.entries())
              )
            },
            "Timeout elapsed waiting for network idle, continuing anyways..."
          );
        }
        return false;
      });
      const waitResult = yield waitForNetworkIdle();
      this.page.off("requestfinished", requestFinishedListener);
      this.page.off("request", requestFiredListener);
      if (!waitResult) {
        return unwrapAndThrowError(retPromise);
      }
      if (!rejected && urlChanged(this.url, startURL)) {
        this.logger.debug(
          { startURL, newURL: this.url },
          `Detected url change in wrapPossibleNavigation, waiting for load state`
        );
        const remainingTimeout = Math.max(
          timeoutMS - (Date.now() - startTime),
          0
        );
        if (remainingTimeout > 0) {
          try {
            yield this.page.waitForLoadState("load", {
              timeout: remainingTimeout
            });
          } catch (e) {
            this.logger.warn(
              { url: this.url },
              "Timeout elapsed waiting for load state to fire, continuing anyways..."
            );
          }
        }
      }
      return unwrapAndThrowError(retPromise);
    });
  }
  /**
   * Given a potentially cached a11y ID, resolve it to an actual ID, checking that it is still valid.
   * If the ID is no longer valid, try to auto-heal with heuristics.
   * Throws if no auto-healing is possible.
   */
  resolveCachedTargetToID(target) {
    return __async(this, null, function* () {
      if (!target.name && !target.role && !target.content) {
        const node = this.nodeMap.get(`${target.id}`);
        if (!node) {
          throw new Error(
            `Resolving target failed, fresh value did not exist in node map: ${target.id}`
          );
        }
        saveNodeDetailsToCache(node, target);
        return target.id;
      }
      yield this.getA11yTree();
      const proposedNode = this.nodeMap.get(`${target.id}`);
      if (proposedNode) {
        const comparisonScore = getNodeComparisonScore(proposedNode, target);
        if (comparisonScore >= MIN_SIMILARITY_SCORE_TO_REUSE) {
          this.logger.debug(
            { target, proposedNode: proposedNode.getLogForm(), comparisonScore },
            "Resolved cached a11y target to node with exact same id"
          );
          saveNodeDetailsToCache(proposedNode, target);
          return target.id;
        }
      }
      let closestLevenshteinDistance = Infinity;
      let smallestLevenshteinRatio = Infinity;
      let closestNode;
      for (const node of this.nodeMap.values()) {
        const comparisonScore = getNodeComparisonScore(node, target);
        if (comparisonScore >= MIN_SIMILARITY_SCORE_TO_REUSE) {
          this.logger.debug(
            { newNode: node.getLogForm(), target, comparisonScore },
            "Resolved cached a11y target to new node with field comparison"
          );
          saveNodeDetailsToCache(node, target);
          return parseInt(node.id);
        }
        if (target.serializedForm) {
          const serializedNode = node.serialize({
            noID: true,
            maxLevel: 1,
            neighbors: 1
          });
          if (Math.abs(serializedNode.length - target.serializedForm.length) > MAX_LEVENSHTEIN_DISTANCE) {
            continue;
          }
          const levenshteinDistance = distance2(
            target.serializedForm,
            serializedNode
          );
          const ratio = levenshteinDistance / Math.min(target.serializedForm.length, serializedNode.length);
          if (levenshteinDistance < closestLevenshteinDistance && ratio < MAX_LEVENSHTEIN_CHANGE_RATIO) {
            closestLevenshteinDistance = levenshteinDistance;
            smallestLevenshteinRatio = ratio;
            closestNode = node;
          }
        }
      }
      if (closestNode && closestLevenshteinDistance < MAX_LEVENSHTEIN_DISTANCE) {
        this.logger.debug(
          {
            newNode: closestNode.getLogForm(),
            target,
            distance: closestLevenshteinDistance,
            ratio: smallestLevenshteinRatio
          },
          "Resolved cached a11y target to new node with pure levenshtein distance"
        );
        saveNodeDetailsToCache(closestNode, target);
        return parseInt(closestNode.id);
      }
      throw new Error(
        `Could not find any relevant node given cached target: ${JSON.stringify(
          target
        )}`
      );
    });
  }
  click(_0) {
    return __async(this, arguments, function* (target, options = {}) {
      const id = yield this.resolveCachedTargetToID(target);
      const elementInteracted = yield this.wrapPossibleNavigation(
        () => this.clickByA11yID(id, options)
      );
      return elementInteracted;
    });
  }
  hover(target) {
    return __async(this, null, function* () {
      const nodeId = yield this.resolveCachedTargetToID(target);
      const node = this.nodeMap.get(`${nodeId}`);
      if (!node) {
        throw new Error(`Could not find DOM node for hover: ${nodeId}`);
      }
      if (!node.backendNodeID) {
        throw new Error(
          `Hover target missing backend node id: ${node.getLogForm()}`
        );
      }
      const locator = yield this.getLocatorFromBackendID(node.backendNodeID);
      yield locator.hover({
        timeout: BROWSER_ACTION_TIMEOUT_MS
      });
      yield this.highlightNode(node);
      return node.serialize({ noChildren: true, noProperties: true, noID: true });
    });
  }
  selectOption(target, option) {
    return __async(this, null, function* () {
      const id = yield this.resolveCachedTargetToID(target);
      return this.selectOptionByA11yID(id, option);
    });
  }
  press(key) {
    return __async(this, null, function* () {
      yield this.wrapPossibleNavigation(() => this.page.keyboard.press(key));
    });
  }
  refresh() {
    return __async(this, null, function* () {
      yield this.page.reload();
      yield this.pageSetup();
    });
  }
  getA11yTree() {
    return __async(this, null, function* () {
      let processedTree = null;
      let attempt = 0;
      const url = this.url;
      while (!processedTree) {
        try {
          this.logger.debug(`Getting a11y tree at ${url}`);
          const graph = yield this.getRawA11yTree();
          if (!graph.root || graph.allNodes.length === 0) {
            throw new Error("No a11y tree found on page");
          }
          processedTree = processA11yTree(graph);
        } catch (e) {
          this.logger.error({ err: e, url }, "Error fetching a11y tree");
          if (attempt === 0) {
            yield sleep(1e3);
            attempt++;
          } else {
            throw new Error(`Max retries exceeded fetching a11y tree: ${e}`);
          }
        }
      }
      if (!processedTree.root) {
        this.logger.warn("A11y tree was pruned entirely");
      }
      this.nodeMap = processedTree.nodeMap;
      return processedTree;
    });
  }
  getRawA11yTree() {
    return __async(this, null, function* () {
      const url = this.page.url();
      let lastTreeUpdateTimestamp = Date.now();
      const treeUpdateListener = () => {
        lastTreeUpdateTimestamp = Date.now();
      };
      this.cdpClient.addListener(
        "Accessibility.nodesUpdated",
        treeUpdateListener
      );
      let accessibilityTreeLoadFired = false;
      const accessibilityLoadListener = () => {
        this.logger.info({ url }, `Load event fired on page`);
        accessibilityTreeLoadFired = true;
      };
      this.cdpClient.addListener(
        "Accessibility.loadComplete",
        accessibilityLoadListener
      );
      const a11yLoadStart = Date.now();
      let timeoutTriggered = true;
      while (Date.now() - a11yLoadStart < A11Y_STABLE_TIMEOUT_MS) {
        yield sleep(CHECK_INTERVAL_MS);
        if (!accessibilityTreeLoadFired && Date.now() - a11yLoadStart < A11Y_LOAD_TIMEOUT_MS && process.env.NODE_ENV !== "production") {
          this.logger.debug({ url }, `A11y tree not loaded yet, waiting...`);
          continue;
        }
        if (Date.now() - lastTreeUpdateTimestamp >= A11Y_STABLE_DURATION_MS) {
          this.logger.debug({ url }, `A11y tree not stable yet, waiting...`);
          continue;
        }
        timeoutTriggered = false;
        break;
      }
      this.logger.debug(
        {
          duration: Date.now() - a11yLoadStart,
          eventReceived: accessibilityTreeLoadFired,
          timeoutTriggered
        },
        "A11y wait phase completed"
      );
      const { node: root } = yield this.cdpClient.send(
        "Accessibility.getRootAXNode"
      );
      const { nodes } = yield this.cdpClient.send("Accessibility.queryAXTree", {
        backendNodeId: root.backendDOMNodeId
      });
      this.cdpClient.removeListener(
        "Accessibility.loadComplete",
        accessibilityLoadListener
      );
      this.cdpClient.removeListener(
        "Accessibility.nodesUpdated",
        treeUpdateListener
      );
      return {
        root,
        allNodes: nodes
      };
    });
  }
  clickUsingVisualCoordinates(backendNodeId) {
    return __async(this, null, function* () {
      const location = yield this.getElementLocation(backendNodeId);
      if (!location) {
        throw new Error(
          `Could not find element location with backend node id: ${backendNodeId}`
        );
      }
      this.logger.debug({ location }, "Executing mouse click");
      yield this.page.mouse.click(location.centerX, location.centerY);
    });
  }
  // Get the "id" attribute value from an HTML element.
  getIDAttributeUsingCDP(objectId) {
    return __async(this, null, function* () {
      yield this.cdpClient.send("DOM.getDocument", { depth: 0 });
      const cdpNodeResult = yield this.cdpClient.send("DOM.requestNode", {
        objectId
      });
      const attrResult = yield this.cdpClient.send("DOM.getAttributes", {
        nodeId: cdpNodeResult.nodeId
      });
      const attributes = attrResult.attributes;
      const indexAttr = attributes.findIndex((s) => s === "data-momentic-id");
      if (indexAttr === -1) {
        return "";
      }
      return attributes[indexAttr + 1] || "";
    });
  }
  getLocatorFromBackendID(backendNodeId) {
    return __async(this, null, function* () {
      yield this.page.evaluate(addIDsScript);
      const cdpResolveResult = yield this.cdpClient.send("DOM.resolveNode", {
        backendNodeId
      });
      if (!cdpResolveResult || !cdpResolveResult.object.objectId) {
        throw new Error(`Could not resolve backend node ${backendNodeId}`);
      }
      try {
        const id = yield this.getIDAttributeUsingCDP(
          cdpResolveResult.object.objectId
        );
        if (!id) {
          throw new Error("Failed getting data-momentic-id attribute using CDP");
        }
        return this.page.locator(`[data-momentic-id="${id}"]`);
      } catch (err) {
        this.logger.error(
          {
            err
          },
          "Failed to get ID attribute"
        );
        throw err;
      }
    });
  }
  clickUsingCDP(_0) {
    return __async(this, arguments, function* (originalNode, options = {}) {
      let clickAttempts = 0;
      let candidateNode = originalNode;
      while (clickAttempts < MAX_BROWSER_ACTION_ATTEMPTS) {
        if (!candidateNode || candidateNode.role === "RootWebArea") {
          throw new Error(
            `Attempted to click node with no clickable surrounding elements: ${originalNode.getLogForm()}`
          );
        }
        if (candidateNode.role === "StaticText") {
          candidateNode = candidateNode.parent;
          continue;
        }
        const candidateNodeID = candidateNode.backendNodeID;
        if (!candidateNodeID) {
          this.logger.warn(
            { node: candidateNode.getLogForm() },
            "Click candidate had no backend node ID"
          );
          candidateNode = candidateNode.parent;
          continue;
        }
        try {
          const locator = yield this.getLocatorFromBackendID(candidateNodeID);
          if (options.doubleClick) {
            yield locator.dblclick({
              timeout: BROWSER_ACTION_TIMEOUT_MS
            });
          } else {
            yield locator.click({
              timeout: BROWSER_ACTION_TIMEOUT_MS,
              button: options.rightClick ? "right" : "left"
            });
          }
          if (candidateNode.id !== originalNode.id) {
            this.logger.info(
              {
                oldNode: originalNode.getLogForm(),
                newNode: candidateNode.getLogForm()
              },
              `Redirected click successfully to new element`
            );
          }
          return candidateNode;
        } catch (err) {
          this.logger.error(
            { err, node: candidateNode.getLogForm() },
            "Failed click or click timed out"
          );
          clickAttempts++;
          candidateNode = candidateNode.parent;
        }
      }
      throw new Error(
        `Max click redirection attempts exhausted on original element: ${originalNode.getLogForm()}`
      );
    });
  }
  /**
   * Currently unused, but could be useful for vision model integration.
   * Gets x/y position of an a11y node.
   */
  getElementLocation(backendNodeId) {
    return __async(this, null, function* () {
      const tree = yield this.cdpClient.send("DOMSnapshot.captureSnapshot", {
        computedStyles: [],
        includeDOMRects: true,
        includePaintOrder: true
      });
      let devicePixelRatio = yield this.page.evaluate(
        () => window.devicePixelRatio
      );
      if (process.platform === "darwin" && devicePixelRatio === 1) {
        devicePixelRatio = RETINA_WINDOW_SCALE_FACTOR;
      }
      const document2 = tree["documents"][0];
      const layout = document2["layout"];
      const nodes = document2["nodes"];
      const nodeNames = nodes["nodeName"] || [];
      const backendNodeIds = nodes["backendNodeId"] || [];
      const layoutNodeIndex = layout["nodeIndex"];
      const bounds = layout["bounds"];
      let cursor2 = -1;
      for (let i = 0; i < nodeNames.length; i++) {
        if (backendNodeIds[i] === backendNodeId) {
          cursor2 = layoutNodeIndex.indexOf(i);
          break;
        }
      }
      if (cursor2 === -1) {
        throw new Error(
          `Could not find any backend node with ID ${backendNodeId}`
        );
      }
      let [x = 0, y = 0, width = 0, height = 0] = bounds[cursor2];
      x /= devicePixelRatio;
      y /= devicePixelRatio;
      width /= devicePixelRatio;
      height /= devicePixelRatio;
      const centerX = x + width / 2;
      const centerY = y + height / 2;
      return { centerX, centerY };
    });
  }
  scrollUp() {
    return __async(this, null, function* () {
      yield this.page.evaluate(() => {
        (document.scrollingElement || document.body).scrollTop = (document.scrollingElement || document.body).scrollTop - window.innerHeight;
      });
      yield this.page.evaluate(() => {
        (document.scrollingElement || document.body).scrollTop = (document.scrollingElement || document.body).scrollTop + window.innerHeight;
      });
    });
  }
  scrollDown() {
    return __async(this, null, function* () {
      yield this.page.evaluate(() => {
        (document.scrollingElement || document.body).scrollTop = (document.scrollingElement || document.body).scrollTop + window.innerHeight;
      });
    });
  }
  goForward() {
    return __async(this, null, function* () {
      yield this.wrapPossibleNavigation(
        () => this.page.goForward({ timeout: MAX_LOAD_TIMEOUT_MS })
      );
      yield this.pageSetup();
    });
  }
  goBack() {
    return __async(this, null, function* () {
      yield this.wrapPossibleNavigation(
        () => this.page.goBack({ timeout: MAX_LOAD_TIMEOUT_MS })
      );
      yield this.pageSetup();
    });
  }
  switchToPage(urlSubstring) {
    return __async(this, null, function* () {
      const allPages = yield this.context.pages();
      for (let i = 0; i < allPages.length; i++) {
        const page = allPages[i];
        if (page.url().includes(urlSubstring)) {
          this.page = page;
          yield page.waitForLoadState("load", {
            timeout: MAX_LOAD_TIMEOUT_MS
          });
          yield this.pageSetup();
          this.cdpClient = yield this.context.newCDPSession(page);
          yield initCDPSession(this.cdpClient);
          this.logger.info(`Switching to tab ${i} with url ${page.url()}`);
          return;
        }
      }
      throw new Error(`Could not find page with url containing ${urlSubstring}`);
    });
  }
  setCookie(cookie) {
    return __async(this, null, function* () {
      const cookieSettings = parseCookieString(cookie);
      yield this.context.addCookies([cookieSettings]);
    });
  }
};
_ChromeBrowser.USER_AGENT = devices["Desktop Chrome"].userAgent;
var ChromeBrowser = _ChromeBrowser;

// ../../packages/web-agent/src/configs/controller.ts
var A11Y_CONTROLLER_CONFIG = {
  type: "a11y",
  version: "1.0.0",
  useHistory: "diff",
  useGoalSplitter: true
};
var DEFAULT_CONTROLLER_CONFIG = A11Y_CONTROLLER_CONFIG;

// ../../packages/web-agent/src/controller.ts
import dedent2 from "dedent";
import diffLines from "diff-lines";
var MAX_HISTORY_CHAR_LENGTH = 1e4;
var AgentController = class {
  constructor({ browser, config, generator, logger }) {
    this.browser = browser;
    this.generator = generator;
    this.config = config;
    this.logger = logger;
    this.pendingInstructions = [];
    this.commandHistory = [];
  }
  /**
   * Get copy of executed commands in human readable form. Most recent is last.
   * Only commands that have completed execution are returned.
   */
  get history() {
    return this.commandHistory.filter((cmd) => cmd.state === "DONE");
  }
  get lastExecutedCommand() {
    const history = this.history;
    if (history.length === 0)
      return null;
    const lastEntry = history[history.length - 1];
    return lastEntry;
  }
  /**
   * Reset the command history provided to agents.
   * Should be called due to a logical break between commands
   * such as a SUCCESS being issued.
   */
  resetHistory() {
    this.commandHistory = [];
    this.pendingInstructions = [];
  }
  /**
   * Reset controller and browser state.
   */
  resetState() {
    return __async(this, null, function* () {
      this.resetHistory();
      yield this.browser.navigate(this.browser.baseURL);
    });
  }
  /**
   * Get the browser state as a string
   */
  getBrowserState() {
    return __async(this, null, function* () {
      const a11yTree = yield this.browser.getA11yTree();
      return a11yTree.serialize();
    });
  }
  getSerializedHistory(url, currentBrowserState) {
    let history;
    if (this.config.useHistory === "diff") {
      history = this.getDiffHistory(url, currentBrowserState);
    } else {
      history = this.getListHistory();
    }
    return history;
  }
  splitUserGoal(type, goal, disableCache) {
    return __async(this, null, function* () {
      if (type === "AI_ACTION" /* AI_ACTION */ && goal.match(/[,!;.]|(?:and)|(?:then)/) && this.config.useGoalSplitter) {
        const granularInstructions = yield this.generator.getGranularGoals(
          { goal, url: this.browser.url },
          disableCache
        );
        this.pendingInstructions = granularInstructions.reverse();
      } else {
        this.pendingInstructions = [goal];
      }
    });
  }
  /**
   * Given previously executed commands, generate command for the current prompt.
   * Should only be used for AI action.
   */
  promptToCommand(type, goal, disableCache) {
    return __async(this, null, function* () {
      if (this.pendingInstructions.length === 0) {
        yield this.splitUserGoal(type, goal, disableCache);
      }
      const currInstruction = this.pendingInstructions[this.pendingInstructions.length - 1];
      this.logger.info({ goal: currInstruction }, "Starting prompt translation");
      const getBrowserStateStart = Date.now();
      const url = this.browser.url;
      const browserState = yield this.getBrowserState();
      this.logger.info(
        {
          duration: Date.now() - getBrowserStateStart,
          url
        },
        "Got browser state"
      );
      const numPrevious = this.commandHistory.length;
      this.commandHistory.push({
        state: "PENDING",
        browserStateBeforeCommand: browserState,
        urlBeforeCommand: url,
        type
      });
      const history = this.getSerializedHistory(url, browserState);
      const getCommandProposalStart = Date.now();
      const proposedCommand = yield this.generator.getProposedCommand(
        {
          url,
          numPrevious,
          browserState,
          history,
          goal: currInstruction,
          lastCommand: this.lastExecutedCommand
        },
        disableCache
      );
      this.logger.info(
        { duration: Date.now() - getCommandProposalStart },
        "Got proposed command"
      );
      if (proposedCommand.type === "SUCCESS" /* SUCCESS */) {
        const finishedInstruction = this.pendingInstructions.pop();
        this.logger.info(
          {
            finishedInstruction,
            remainingInstructions: this.pendingInstructions
          },
          "Removing pending instruction due to SUCCESS"
        );
        if (this.pendingInstructions.length !== 0) {
          this.commandHistory.pop();
          return this.promptToCommand(type, "", disableCache);
        }
      } else if (
        // on failure, we don't continue to execute
        proposedCommand.type === "FAILURE"
      ) {
        this.logger.info(
          {
            remainingInstructions: this.pendingInstructions
          },
          "Removing pending instructions due to FAILURE"
        );
        this.pendingInstructions = [];
      }
      return proposedCommand;
    });
  }
  locateElement(description, disableCache) {
    return __async(this, null, function* () {
      if (!description) {
        throw new Error("Cannot locate element with empty description");
      }
      const locator = yield this.generator.getElementLocation(
        { browserState: yield this.getBrowserState(), goal: description },
        disableCache
      );
      if (locator.id < 0) {
        throw new Error(
          `Unable to locate element with description: ${description}`
        );
      }
      return locator;
    });
  }
  /**
   * Construct a detailed history that can be passed to the LLM.
   * History includes commands executed as well as browser state changes that occurred
   * at each step.
   */
  getDiffHistory(currentURL, currentPageState) {
    const doneCommands = this.history.filter(
      (h) => h.type === "AI_ACTION" /* AI_ACTION */
    );
    if (doneCommands.length === 0)
      return "<NONE/>";
    const historyLines = [
      "\nYou have already executed the following commands successfully (most recent listed first)",
      "-".repeat(10)
    ];
    doneCommands.reverse().forEach((log, i) => {
      historyLines.push(
        `COMMAND ${doneCommands.length - i}${i === 0 ? " (command just executed)" : ""}: ${log.serializedCommand}`
      );
      if (i === 0) {
        if (urlChanged(log.urlBeforeCommand, currentURL)) {
          historyLines.push(
            `  URL CHANGE: '${log.urlBeforeCommand}' -> '${currentURL}'`
          );
        } else {
          const browserStateDiff = diffLines(
            log.browserStateBeforeCommand,
            currentPageState,
            {
              n_surrounding: 1
            }
          );
          if (!browserStateDiff) {
            historyLines.push("PAGE CONTENT CHANGE: <NONE/>");
          } else if (browserStateDiff.length < MAX_HISTORY_CHAR_LENGTH) {
            historyLines.push("PAGE CONTENT CHANGE:");
            browserStateDiff.split("\n").forEach((l) => historyLines.push(`  ${l}`));
          } else {
            historyLines.push("PAGE CONTENT CHANGE: <TOO_LONG_TO_DISPLAY/>");
          }
        }
      }
      historyLines.push("-".repeat(10));
    });
    historyLines.push(`STARTING URL: ${this.browser.baseURL}`);
    return historyLines.join("\n");
  }
  getListHistory() {
    return dedent2`Here are the commands that you have successfully executed:
    ${this.commandHistory.filter((cmd) => cmd.type === "AI_ACTION" /* AI_ACTION */).map((cmd) => `- ${cmd.serializedCommand}`).join("\n")}`;
  }
  /**
   * Given a command, interact with the chromium browser to actually execute the actions
   * @param [stateless=false] Execute this command in a stateless fashion, without modifying any controller state such as
   * pending instructions. Useful when executing cached instructions.
   */
  executeCommand(command, disableCache, stateless = false) {
    return __async(this, null, function* () {
      const pendingHistory = this.commandHistory[this.commandHistory.length - 1];
      if (!stateless) {
        if (!pendingHistory || pendingHistory.state !== "PENDING") {
          throw new Error(
            "Executing command but there is no pending entry in the history"
          );
        }
      } else {
        yield this.browser.getA11yTree();
      }
      let result;
      try {
        const executionStart = Date.now();
        result = yield this.executePresetStep(
          command,
          disableCache
        );
        const duration = Date.now() - executionStart;
        this.logger.debug({ result, duration }, "Got execution result");
      } catch (e) {
        if (e instanceof Error) {
          throw new BrowserExecutionError(`Failed to execute command: ${e}`, {
            cause: e
          });
        }
        throw new BrowserExecutionError(
          `Unexpected throw from executing command`,
          {
            cause: new Error(`${e}`)
          }
        );
      }
      if (result.succeedImmediately && !stateless) {
        this.pendingInstructions.pop();
        if (this.pendingInstructions.length > 0) {
          result.succeedImmediately = false;
        }
      }
      if (result.elementInteracted && "target" in command && !command.target.elementDescriptor) {
        command.target.elementDescriptor = result.elementInteracted.trim();
      }
      if (!stateless) {
        pendingHistory.generatedStep = command;
        pendingHistory.serializedCommand = serializeCommand(command);
        pendingHistory.state = "DONE";
      }
      return result;
    });
  }
  executeAssertion(urlBeforeCommand, command) {
    return __async(this, null, function* () {
      let params;
      if (command.useVision) {
        params = {
          goal: command.assertion,
          url: urlBeforeCommand,
          // used for vision only
          screenshot: yield this.browser.screenshot(),
          // unused for visual assertion
          browserState: "",
          history: "",
          numPrevious: -1,
          lastCommand: null
        };
      } else {
        const browserState = yield this.getBrowserState();
        const history = this.getSerializedHistory(urlBeforeCommand, browserState);
        params = {
          goal: command.assertion,
          url: urlBeforeCommand,
          // used for text only
          browserState,
          history,
          lastCommand: this.lastExecutedCommand,
          numPrevious: this.commandHistory.length
        };
      }
      const assertionEval = yield this.generator.getAssertionResult(
        params,
        command.useVision,
        command.disableCache
      );
      if (assertionEval.relevantElements) {
        void Promise.all(
          assertionEval.relevantElements.map(
            (id) => this.browser.highlight({ id })
          )
        );
      }
      if (!assertionEval.result) {
        throw new Error(assertionEval.thoughts);
      }
      return {
        succeedImmediately: false,
        thoughts: assertionEval.thoughts,
        urlAfterCommand: urlBeforeCommand
      };
    });
  }
  wrapElementTargetingCommand(target, disableCache, action, newlyGenerated = false) {
    return __async(this, null, function* () {
      if (!target.a11yData) {
        target.a11yData = A11yTargetWithCacheSchema.parse(
          yield this.locateElement(target.elementDescriptor, disableCache)
        );
        newlyGenerated = true;
      }
      try {
        const result = yield action(target.a11yData);
        this.logger.debug(
          { target },
          "Successfully used cached target to perform action"
        );
        return result;
      } catch (err) {
        if (!newlyGenerated) {
          this.logger.warn(
            { err, target },
            "Failed to execute action with cached target, retrying with AI"
          );
          target.a11yData = void 0;
          return this.wrapElementTargetingCommand(
            target,
            disableCache,
            action,
            true
          );
        }
        this.logger.error(
          { err, target },
          "Failed to target element even after all auto-healing"
        );
        throw new Error(
          `Failed to find element with description: ${target.elementDescriptor}. Has your website changed significantly?`
        );
      }
    });
  }
  /**
   * Executes a preset command.
   * For most cases, the execution result contains metadata about the command executed.
   * For assertions, an AssertionResult with thoughts is returned.
   * Throws on failure.
   */
  executePresetStep(command, disableCache) {
    return __async(this, null, function* () {
      var _a;
      const urlBeforeCommand = this.browser.url;
      switch (command.type) {
        case "SUCCESS" /* SUCCESS */:
          if ((_a = command.condition) == null ? void 0 : _a.assertion.trim()) {
            return this.executeAssertion(urlBeforeCommand, command.condition);
          }
          return {
            succeedImmediately: false,
            urlAfterCommand: this.browser.url
          };
        case "AI_ASSERTION" /* AI_ASSERTION */: {
          return this.executeAssertion(urlBeforeCommand, command);
        }
        case "NAVIGATE" /* NAVIGATE */:
          yield this.browser.navigate(command.url);
          break;
        case "GO_BACK" /* GO_BACK */:
          yield this.browser.goBack();
          break;
        case "GO_FORWARD" /* GO_FORWARD */:
          yield this.browser.goForward();
          break;
        case "SCROLL_DOWN" /* SCROLL_DOWN */:
          yield this.browser.scrollDown();
          break;
        case "SCROLL_UP" /* SCROLL_UP */:
          yield this.browser.scrollUp();
          break;
        case "WAIT" /* WAIT */:
          yield this.browser.wait(command.delay * 1e3);
          break;
        case "REFRESH" /* REFRESH */:
          yield this.browser.refresh();
          break;
        case "CLICK" /* CLICK */: {
          const elementInteracted = yield this.wrapElementTargetingCommand(
            command.target,
            disableCache,
            (target) => this.browser.click(target, {
              doubleClick: command.doubleClick,
              rightClick: command.rightClick
            })
          );
          const result2 = {
            urlAfterCommand: this.browser.url,
            succeedImmediately: false,
            elementInteracted
          };
          if (urlChanged(urlBeforeCommand, result2.urlAfterCommand)) {
            result2.succeedImmediately = true;
            result2.succeedImmediatelyReason = "URL changed";
          }
          return result2;
        }
        case "SELECT_OPTION" /* SELECT_OPTION */: {
          const elementInteracted = yield this.wrapElementTargetingCommand(
            command.target,
            disableCache,
            (targetWithA11yData) => this.browser.selectOption(targetWithA11yData, command.option)
          );
          return {
            succeedImmediately: false,
            urlAfterCommand: this.browser.url,
            elementInteracted
          };
        }
        case "TAB" /* TAB */:
          yield this.browser.switchToPage(command.url);
          break;
        case "COOKIE" /* COOKIE */:
          if (!command.value) {
            break;
          }
          yield this.browser.setCookie(command.value);
          break;
        case "TYPE" /* TYPE */: {
          const elementInteracted = yield this.wrapElementTargetingCommand(
            command.target,
            disableCache,
            (target) => this.browser.click(target)
          );
          yield this.browser.type(command.value, {
            clearContent: command.clearContent,
            pressKeysSequentially: command.pressKeysSequentially
          });
          if (command.pressEnter) {
            yield this.browser.press("Enter");
          }
          const result2 = {
            urlAfterCommand: this.browser.url,
            succeedImmediately: false,
            elementInteracted
          };
          if (urlChanged(urlBeforeCommand, result2.urlAfterCommand)) {
            result2.succeedImmediately = true;
            result2.succeedImmediatelyReason = "URL changed";
          }
          return result2;
        }
        case "HOVER" /* HOVER */: {
          const elementInteracted = yield this.wrapElementTargetingCommand(
            command.target,
            disableCache,
            (target) => this.browser.hover(target)
          );
          return {
            succeedImmediately: false,
            urlAfterCommand: this.browser.url,
            elementInteracted
          };
        }
        case "PRESS" /* PRESS */:
          yield this.browser.press(command.value);
          const result = {
            urlAfterCommand: this.browser.url,
            succeedImmediately: false
          };
          if (urlChanged(urlBeforeCommand, result.urlAfterCommand)) {
            result.succeedImmediately = true;
            result.succeedImmediatelyReason = "URL changed";
          }
          return result;
        default:
          const assertUnreachable = (_x) => {
            throw "If Typescript complains about the line below, you missed a case or break in the switch above";
          };
          return assertUnreachable(command);
      }
      return {
        succeedImmediately: false,
        urlAfterCommand: this.browser.url
      };
    });
  }
};

// ../../packages/web-agent/src/generators/api-generator.ts
import fetchRetry from "fetch-retry";
var fetch = fetchRetry(global.fetch);
var API_VERSION = "v1";
var APIGenerator = class {
  constructor(params) {
    this.baseURL = params.baseURL;
    this.apiKey = params.apiKey;
  }
  getElementLocation(context, disableCache) {
    return __async(this, null, function* () {
      const result = yield this.sendRequest(
        `/${API_VERSION}/web-agent/locate-element`,
        {
          browserState: context.browserState,
          goal: context.goal,
          disableCache
        }
      );
      return LocateResponseSchema.parse(result);
    });
  }
  getAssertionResult(context, useVision, disableCache) {
    return __async(this, null, function* () {
      var _a;
      if (useVision) {
        const result2 = yield this.sendRequest(
          `/${API_VERSION}/web-agent/assertion`,
          {
            url: context.url,
            goal: context.goal,
            screenshot: (_a = context.screenshot) == null ? void 0 : _a.toString("base64"),
            disableCache,
            vision: true
          }
        );
        return GetAssertionResponseSchema.parse(result2);
      }
      const result = yield this.sendRequest(
        `/${API_VERSION}/web-agent/assertion`,
        {
          url: context.url,
          browserState: context.browserState,
          goal: context.goal,
          history: context.history,
          numPrevious: context.numPrevious,
          lastCommand: context.lastCommand,
          disableCache,
          vision: false
        }
      );
      return GetAssertionResponseSchema.parse(result);
    });
  }
  getProposedCommand(context, disableCache) {
    return __async(this, null, function* () {
      const result = yield this.sendRequest(
        `/${API_VERSION}/web-agent/next-command`,
        {
          url: context.url,
          browserState: context.browserState,
          goal: context.goal,
          history: context.history,
          numPrevious: context.numPrevious,
          lastCommand: context.lastCommand,
          disableCache
        }
      );
      return GetNextCommandResponseSchema.parse(result);
    });
  }
  getGranularGoals(context, disableCache) {
    return __async(this, null, function* () {
      const result = yield this.sendRequest(
        `/${API_VERSION}/web-agent/split-goal`,
        {
          url: context.url,
          goal: context.goal,
          disableCache
        }
      );
      return SplitGoalResponseSchema.parse(result);
    });
  }
  sendRequest(path, body) {
    return __async(this, null, function* () {
      const response = yield fetch(`${this.baseURL}${path}`, {
        retries: 1,
        retryDelay: 1e3,
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`
        }
      });
      if (!response.ok) {
        throw new Error(
          `Request to ${path} failed with status ${response.status}: ${yield response.text()}`
        );
      }
      return response.json();
    });
  }
};
export {
  APIGenerator,
  AgentController,
  ChromeBrowser,
  CommandType,
  DEFAULT_CONTROLLER_CONFIG,
  StepType
};
