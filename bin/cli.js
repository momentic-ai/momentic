#!/usr/bin/env node
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
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

// src/cli.ts
import { Command as Command4, Option } from "commander";

// package.json
var version = "1.0.0";

// src/install-browsers.ts
import { registry } from "playwright-core/lib/server";
function installBrowsers() {
  return __async(this, null, function* () {
    const executables = registry.defaultExecutables();
    yield registry.install(executables, false);
  });
}

// src/run-tests-locally.ts
import exec from "@actions/exec";
import io from "@actions/io";
import chalk from "chalk";
import quote from "quote";
import parseArgsStringToArgv2 from "string-argv";
import waitOnFn from "wait-on";

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
  CommandType2["SUCCESS"] = "SUCCESS";
  return CommandType2;
})(CommandType || {});
var ElementDescriptorSchema = z2.object({
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
    target: ElementDescriptorSchema,
    doubleClick: z2.boolean().default(false),
    rightClick: z2.boolean().default(false)
  })
).describe(
  dedent`CLICK <id> - click on the element that has the specified id.
  You are NOT allowed to click on disabled, hidden or StaticText elements.
  Only click on elements on the Current Page.
  Only click on elements with the following tag names: button, input, link, image, generic.
  `.replace("\n", " ")
);
var SelectOptionCommandSchema = CommonCommandSchema.merge(
  z2.object({
    type: z2.literal("SELECT_OPTION" /* SELECT_OPTION */),
    target: ElementDescriptorSchema,
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
    target: ElementDescriptorSchema,
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
  CookieCommandSchema
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

// ../../node_modules/.pnpm/playwright@1.40.1/node_modules/playwright/index.mjs
var playwright_exports = {};
__export(playwright_exports, {
  default: () => playwright_default
});
__reExport(playwright_exports, playwright_core_star);
import * as playwright_core_star from "playwright-core";
import playwright from "playwright-core";
var playwright_default = playwright;

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

// ../../packages/types/src/goal-splitter.ts
import { z as z8 } from "zod";
var InstructionsSchema = z8.string().array();

// ../../packages/types/src/locator.ts
import * as z9 from "zod";
var AILocatorSchema = z9.object({
  thoughts: z9.string(),
  // a11y id
  id: z9.number().int(),
  // dropdowns should have options
  options: z9.array(z9.string()).optional()
});

// ../../packages/types/src/modules.ts
import { z as z10 } from "zod";
var ModuleMetadataSchema = z10.object({
  id: z10.string(),
  createdAt: z10.coerce.date(),
  createdBy: z10.string(),
  organizationId: z10.string().or(z10.null()),
  name: z10.string(),
  schemaVersion: z10.string(),
  // this is only used in the client and is not stored in the db
  numSteps: z10.number()
});
var ModuleSchema = z10.object({
  steps: AllowedModuleStepSchema.array()
}).merge(ModuleMetadataSchema.omit({ numSteps: true }));

// ../../packages/types/src/runs.ts
import { z as z11 } from "zod";
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
var DateOrStringSchema = z11.string().pipe(z11.coerce.date()).or(z11.date());
var RunMetadataSchema = z11.object({
  id: z11.string(),
  createdAt: DateOrStringSchema,
  createdBy: z11.string(),
  organizationId: z11.string().or(z11.null()),
  scheduledAt: DateOrStringSchema.or(z11.null()),
  startedAt: DateOrStringSchema.or(z11.null()),
  finishedAt: DateOrStringSchema.or(z11.null()),
  testId: z11.string().or(z11.null()),
  status: z11.nativeEnum(RunStatusEnum),
  trigger: z11.nativeEnum(RunTriggerEnum),
  test: z11.object({
    name: z11.string(),
    id: z11.string()
  }).or(z11.null())
});
var RunWithTestSchema = RunMetadataSchema.merge(
  z11.object({
    results: ResultSchema.array(),
    test: z11.object({
      name: z11.string(),
      id: z11.string(),
      baseUrl: z11.string()
    }).or(z11.null())
  })
);

// ../../packages/types/src/serialization.ts
function clampText(text, length) {
  if (text.length < length) {
    return text;
  }
  return text.slice(0, length - 3) + "[...]";
}
function serializeCommand(command) {
  var _a, _b;
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
    case "TYPE" /* TYPE */:
      let serializedTarget = "";
      if ((_b = command.target.a11yData) == null ? void 0 : _b.serializedForm) {
        serializedTarget = ` in element ${command.target.a11yData.serializedForm}`;
      } else if (command.target.elementDescriptor.length > 0) {
        serializedTarget = ` in element ${command.target.elementDescriptor}`;
      }
      return `Type${serializedTarget}: '${command.value}'`;
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

// ../../packages/types/src/card-display.ts
var SELECTABLE_PRESET_COMMAND_OPTIONS_SET = new Set(
  Object.values(CommandType)
);
var CARD_DISPLAY_NAMES = {
  ["AI_ACTION" /* AI_ACTION */]: "AI action",
  ["MODULE" /* MODULE */]: "Module",
  ["AI_ASSERTION" /* AI_ASSERTION */]: "AI check",
  ["CLICK" /* CLICK */]: "Click",
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

// ../../packages/types/src/test.ts
import { z as z13 } from "zod";

// ../../packages/types/src/test-settings.ts
import { isValidCron } from "cron-validator";
import { z as z12 } from "zod";
var TestAdvancedSettingsSchema = z12.object({
  availableAsModule: z12.boolean().default(false),
  disableAICaching: z12.boolean().default(false)
});
var ScheduleSettingsSchema = z12.object({
  cron: z12.string().refine(
    (v) => {
      return isValidCron(v);
    },
    { message: "Invalid cron expression." }
  ).default("0 0 */1 * *"),
  enabled: z12.boolean().default(false),
  timeZone: z12.string().default("America/Los_Angeles"),
  // this is used for removing repeatable jobs (not set by user)
  jobKey: z12.string().optional()
});
var WebhookSchema = z12.object({
  lastStatus: z12.number().optional(),
  url: z12.string().url()
});
var WebhookSettingsSchema = z12.array(WebhookSchema).default([]);
var TestSettingsSchema = z12.object({
  name: z12.string().min(1),
  baseUrl: z12.string().url(),
  advanced: TestAdvancedSettingsSchema
});

// ../../packages/types/src/test.ts
var ResolvedTestSchema = z13.object({
  id: z13.string(),
  name: z13.string(),
  baseUrl: z13.string(),
  steps: z13.array(ResolvedStepSchema),
  createdAt: z13.coerce.date(),
  updatedAt: z13.coerce.date(),
  createdBy: z13.string(),
  organizationId: z13.string().or(z13.null()),
  schemaVersion: z13.string(),
  advanced: TestAdvancedSettingsSchema,
  schedule: ScheduleSettingsSchema,
  webhooks: WebhookSettingsSchema
});

// ../../packages/types/src/context.ts
import * as z14 from "zod";
var DynamicContextSchema = z14.object({
  // user goal or instruction
  goal: z14.string(),
  // current url of the browser
  url: z14.string(),
  // serialized page state
  browserState: z14.string(),
  // serialized history of previous commands
  history: z14.string(),
  // number of previously executed commands
  numPrevious: z14.number(),
  // last executed command, if any
  lastCommand: ExecuteCommandHistoryEntrySchema.or(z14.null())
});

// ../../packages/types/src/public-api.ts
import * as z15 from "zod";
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
var QueueTestsBodySchema = z15.object({
  testIds: z15.string().array()
});
var GetTestResponseSchema = ResolvedTestSchema;
var CreateRunBodySchema = z15.object({
  testId: z15.string(),
  trigger: z15.nativeEnum(RunTriggerEnum)
});
var CreateRunResponseSchema = RunWithTestSchema;
var GetRunResponseSchema = RunWithTestSchema;
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

// ../../packages/web-agent/src/utils/url.ts
var urlChanged = (url1, url2) => {
  const { hostname, pathname } = new URL(url1);
  const { hostname: hostname2, pathname: pathname2 } = new URL(url2);
  return hostname !== hostname2 || pathname !== pathname2;
};

// ../../packages/web-agent/src/browsers/a11y.ts
var bannedProperties = /* @__PURE__ */ new Set(["focusable"]);
var alwaysInterestingRoles = /* @__PURE__ */ new Set([
  "textbox",
  "checkbox",
  "button",
  "link"
]);
var rolesToOmitID = /* @__PURE__ */ new Set(["paragraph", "menuitem", "option"]);
var defaultA11yNodeSerializeParams = {
  indentLevel: 0,
  noID: false,
  noChildren: false,
  noProperties: false
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
    if (this.children.length === 0 || noChildren) {
      s += " />\n";
      return s;
    } else {
      s += ">\n";
    }
    for (const child of this.children) {
      s += child.serialize({ indentLevel: indentLevel + 2 });
    }
    s += `${indent}</${this.role}>
`;
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
var CHROME_INTERNAL_URLS = /* @__PURE__ */ new Set([
  "about:blank",
  "chrome-error://chromewebdata/"
]);
var MAX_BROWSER_ACTION_ATTEMPTS = 2;

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
      const browser = yield playwright_exports.chromium.launch({ headless: true });
      const context = yield browser.newContext({
        viewport: {
          width: 1920,
          height: 1080
        },
        // comment out the below if you are on Mac OS but you're using a monitor
        deviceScaleFactor: process.platform === "darwin" ? RETINA_WINDOW_SCALE_FACTOR : 1,
        userAgent: playwright_exports.devices["Desktop Chrome"].userAgent,
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
        yield this.page.keyboard.press("Meta+A");
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
        throw new Error(`Could not find node in DOM with index: ${index}`);
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
        throw new Error(`Could not find node in DOM with index: ${index}`);
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
  highlight(target) {
    return __async(this, null, function* () {
      try {
        yield this.highlightByA11yID(target.id);
      } catch (err) {
        this.logger.warn({ err, target }, "Failed to highlight target");
      }
    });
  }
  highlightByA11yID(index) {
    return __async(this, null, function* () {
      const node = this.nodeMap.get(`${index}`);
      if (!node) {
        throw new Error(`Could not find node in DOM with index: ${index}`);
      }
      if (!node.backendNodeID) {
        throw new Error(
          `Select target missing backend node id: ${node.getLogForm()}`
        );
      }
      yield this.highlightNode(node);
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
        this.logger.warn({ err }, "Failed to add node highlight");
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
          this.logger.debug(
            {
              uri: serializeRequest(request)
            },
            "Ignoring request for page load network stability"
          );
          return;
        }
        const key = serializeRequest(request);
        this.logger.debug(
          {
            uri: key
          },
          "Request fired on page load, delaying network stability"
        );
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
              this.logger.debug({ uri: key }, "Waiting on request to finish");
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
        if (!rejected) {
          this.logger.warn(
            {
              url: this.url,
              requests: JSON.stringify(Array.from(unfinishedRequests.entries()))
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
          `Detected url change in wrapPossibleNavigation, waiting for load state`
        );
        try {
          yield this.page.waitForLoadState("load", {
            timeout: timeoutMS - (Date.now() - startTime)
          });
        } catch (e) {
          this.logger.warn(
            { url: this.url },
            "Timeout elapsed waiting for load state to fire, continuing anyways..."
          );
        }
      }
      return unwrapAndThrowError(retPromise);
    });
  }
  click(_0) {
    return __async(this, arguments, function* (target, options = {}) {
      const elementInteracted = yield this.wrapPossibleNavigation(
        () => this.clickByA11yID(target.id, options)
      );
      return elementInteracted;
    });
  }
  selectOption(target, option) {
    return __async(this, null, function* () {
      return this.selectOptionByA11yID(target.id, option);
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
        this.logger.info({ url }, `A11y tree load event fired`);
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
        if (!accessibilityTreeLoadFired && Date.now() - a11yLoadStart < A11Y_LOAD_TIMEOUT_MS) {
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
_ChromeBrowser.USER_AGENT = playwright_exports.devices["Desktop Chrome"].userAgent;
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
        this.logger.info(
          { result, duration: Date.now() - executionStart },
          "Got execution result"
        );
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
  /**
   * Executes a preset command.
   * For most cases, the execution result contains metadata about the command executed.
   * For assertions, an AssertionResult with thoughts is returned.
   * Throws on failure.
   */
  executePresetStep(command, disableCache) {
    return __async(this, null, function* () {
      var _a, _b, _c;
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
          let id;
          if (command.target.a11yData) {
            id = (_b = command.target.a11yData) == null ? void 0 : _b.id;
          } else {
            const locator = yield this.locateElement(
              command.target.elementDescriptor,
              disableCache
            );
            id = locator.id;
          }
          const elementInteracted = yield this.browser.click(
            {
              id
            },
            {
              doubleClick: command.doubleClick,
              rightClick: command.rightClick
            }
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
          let id;
          if (command.target.a11yData) {
            id = (_c = command.target.a11yData) == null ? void 0 : _c.id;
          } else {
            const locator = yield this.locateElement(
              command.target.elementDescriptor,
              disableCache
            );
            id = locator.id;
          }
          const elementInteracted = yield this.browser.selectOption(
            {
              id
            },
            command.option
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
          yield this.browser.setCookie(command.value);
          break;
        case "TYPE" /* TYPE */: {
          let elementInteracted;
          const target = command.target;
          if (target.a11yData) {
            elementInteracted = yield this.browser.click({
              id: target.a11yData.id
            });
          } else if (target.elementDescriptor.length > 0) {
            const locator = yield this.locateElement(
              command.target.elementDescriptor,
              disableCache
            );
            elementInteracted = yield this.browser.click({
              id: locator.id
            });
          }
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
var fetch2 = fetchRetry(global.fetch);
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
      const response = yield fetch2(`${this.baseURL}${path}`, {
        retries: 3,
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

// src/api-client.ts
var API_VERSION2 = "v1";
var APIClient = class {
  constructor(params) {
    this.baseURL = params.baseURL;
    this.apiKey = params.apiKey;
  }
  getRun(runId) {
    return __async(this, null, function* () {
      const result = yield this.sendRequest(`/${API_VERSION2}/runs/${runId}`, {
        method: "GET"
      });
      return GetRunResponseSchema.parse(result);
    });
  }
  createRun(body) {
    return __async(this, null, function* () {
      const result = yield this.sendRequest(`/${API_VERSION2}/runs`, {
        method: "POST",
        body
      });
      return CreateRunResponseSchema.parse(result);
    });
  }
  updateRun(runId, body) {
    return __async(this, null, function* () {
      yield this.sendRequest(`/${API_VERSION2}/runs/${runId}`, {
        method: "PATCH",
        body
      });
    });
  }
  getTest(testId) {
    return __async(this, null, function* () {
      const result = yield this.sendRequest(`/${API_VERSION2}/tests/${testId}`, {
        method: "GET"
      });
      return GetTestResponseSchema.parse(result);
    });
  }
  queueTests(body) {
    return __async(this, null, function* () {
      yield this.sendRequest(`/${API_VERSION2}/tests/queue`, {
        method: "POST",
        body
      });
    });
  }
  uploadScreenshot(body) {
    return __async(this, null, function* () {
      const result = yield this.sendRequest(`/${API_VERSION2}/screenshots`, {
        method: "POST",
        body
      });
      return CreateScreenshotResponseSchema.parse(result);
    });
  }
  sendRequest(path, options) {
    return __async(this, null, function* () {
      const response = yield fetch(`${this.baseURL}${path}`, {
        method: options.method,
        body: options.body ? JSON.stringify(options.body) : void 0,
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
      if (response.status === 204) {
        return response.text();
      }
      return response.json();
    });
  }
};

// ../../packages/execute/src/constants.ts
var MAX_COMMANDS_PER_STEP = 20;

// ../../packages/execute/src/steps/ai.ts
var executeAIStep = (_a) => __async(void 0, null, function* () {
  var _b = _a, {
    controller,
    step,
    logger,
    advanced
  } = _b, callbacks = __objRest(_b, [
    "controller",
    "step",
    "logger",
    "advanced"
  ]);
  var _a2, _b2, _c, _d, _e, _f, _g;
  (_a2 = callbacks.onStarted) == null ? void 0 : _a2.call(callbacks);
  controller.resetHistory();
  const result = __spreadProps(__spreadValues({}, step), {
    startedAt: /* @__PURE__ */ new Date(),
    userAgent: ChromeBrowser.USER_AGENT,
    // placeholder values
    finishedAt: /* @__PURE__ */ new Date(),
    results: [],
    status: "SUCCESS" /* SUCCESS */
  });
  try {
    let commandIndex = 0;
    let useSavedCommands = step.commands && step.commands.length > 0;
    while (true) {
      if (commandIndex > MAX_COMMANDS_PER_STEP) {
        throw new Error(
          `Exceeded max number of commands per step (${MAX_COMMANDS_PER_STEP})`
        );
      }
      let command;
      const startedAt = /* @__PURE__ */ new Date();
      const beforeScreenshotBuffer = yield controller.browser.screenshot();
      const beforeScreenshot = yield callbacks.onSaveScreenshot(
        beforeScreenshotBuffer
      );
      if (useSavedCommands) {
        command = step.commands[commandIndex];
        if (!command) {
          throw new Error(
            `Saved command at index ${commandIndex} is undefined.`
          );
        }
      } else {
        command = yield controller.promptToCommand(
          step.type,
          step.text,
          advanced.disableAICaching
        );
      }
      if (command.type === "FAILURE") {
        result.finishedAt = /* @__PURE__ */ new Date();
        result.status = "FAILED" /* FAILED */;
        result.message = command.thoughts;
        break;
      }
      (_b2 = callbacks.onCommandGenerated) == null ? void 0 : _b2.call(callbacks, {
        commandIndex,
        message: CARD_DISPLAY_NAMES[command.type] || `Unknown command (${command.type})`
      });
      const cmdResult = {
        beforeScreenshot,
        beforeUrl: controller.browser.url,
        startedAt,
        viewport: controller.browser.viewport,
        // placeholder values
        finishedAt: /* @__PURE__ */ new Date(),
        status: "SUCCESS" /* SUCCESS */
      };
      logger.info(
        `Executing command ${commandIndex}: ${serializeCommand(command)}`
      );
      try {
        const executionResult = yield controller.executeCommand(
          command,
          advanced.disableAICaching,
          useSavedCommands
        );
        cmdResult.elementInteracted = executionResult.elementInteracted;
        (_c = callbacks.onCommandExecuted) == null ? void 0 : _c.call(callbacks, {
          commandIndex,
          message: serializeCommand(command),
          command
        });
        const afterScreenshotBuffer = yield controller.browser.screenshot();
        const afterScreenshot = yield callbacks.onSaveScreenshot(
          afterScreenshotBuffer
        );
        cmdResult.afterScreenshot = afterScreenshot;
        cmdResult.afterUrl = controller.browser.url;
        cmdResult.finishedAt = /* @__PURE__ */ new Date();
        const presetActionResult = {
          status: "SUCCESS" /* SUCCESS */,
          startedAt: cmdResult.startedAt,
          finishedAt: cmdResult.finishedAt,
          type: "PRESET_ACTION" /* PRESET_ACTION */,
          command,
          results: [cmdResult]
        };
        result.results.push(presetActionResult);
        if (command.type === "SUCCESS" /* SUCCESS */) {
          result.finishedAt = /* @__PURE__ */ new Date();
          result.status = "SUCCESS" /* SUCCESS */;
          result.message = (_d = executionResult.thoughts) != null ? _d : "All commands completed.";
          break;
        }
        if (executionResult.succeedImmediately && !useSavedCommands) {
          result.finishedAt = /* @__PURE__ */ new Date();
          result.status = "SUCCESS" /* SUCCESS */;
          result.message = executionResult.succeedImmediatelyReason;
          command = {
            type: "SUCCESS" /* SUCCESS */
          };
          (_e = callbacks.onCommandExecuted) == null ? void 0 : _e.call(callbacks, {
            commandIndex: commandIndex + 1,
            message: serializeCommand(command),
            command
          });
          result.results.push(__spreadProps(__spreadValues({}, presetActionResult), {
            command
          }));
          break;
        }
      } catch (err) {
        if (useSavedCommands) {
          useSavedCommands = false;
          commandIndex = 0;
          result.results = [];
          continue;
        }
        cmdResult.status = "FAILED" /* FAILED */;
        cmdResult.message = `${err}`;
        cmdResult.finishedAt = /* @__PURE__ */ new Date();
        cmdResult.afterScreenshot = void 0;
        cmdResult.afterUrl = controller.browser.url;
        result.results.push({
          status: "FAILED" /* FAILED */,
          startedAt: cmdResult.startedAt,
          finishedAt: cmdResult.finishedAt,
          type: "PRESET_ACTION" /* PRESET_ACTION */,
          command,
          results: [cmdResult],
          message: `${err}`
        });
        result.status = "FAILED" /* FAILED */;
        result.finishedAt = /* @__PURE__ */ new Date();
        result.message = `${err}`;
        break;
      }
      commandIndex++;
    }
  } catch (err) {
    result.message = `${err}`;
    result.finishedAt = /* @__PURE__ */ new Date();
    result.status = "FAILED" /* FAILED */;
  }
  if (result.status === "SUCCESS" /* SUCCESS */) {
    (_f = callbacks.onSuccess) == null ? void 0 : _f.call(callbacks, {
      message: result.message || "AI step succeeded.",
      startedAt: result.startedAt.getTime(),
      durationMs: result.finishedAt.getTime() - result.startedAt.getTime()
    });
  } else {
    (_g = callbacks.onFailure) == null ? void 0 : _g.call(callbacks, {
      message: result.message || "AI step errored.",
      startedAt: result.startedAt.getTime(),
      durationMs: result.finishedAt.getTime() - result.startedAt.getTime()
    });
  }
  return result;
});

// ../../packages/execute/src/steps/preset.ts
var executePresetStep = (_a) => __async(void 0, null, function* () {
  var _b = _a, {
    controller,
    step,
    advanced
  } = _b, callbacks = __objRest(_b, [
    "controller",
    "step",
    "advanced"
  ]);
  var _a2, _b2, _c;
  (_a2 = callbacks.onStarted) == null ? void 0 : _a2.call(callbacks);
  const startedAt = /* @__PURE__ */ new Date();
  const beforeUrl = controller.browser.url;
  const beforeScreenshotBuffer = yield controller.browser.screenshot();
  const beforeScreenshot = yield callbacks.onSaveScreenshot(
    beforeScreenshotBuffer
  );
  try {
    const execResult = yield controller.executePresetStep(
      step.command,
      advanced.disableAICaching
    );
    const afterScreenshotBuffer = yield controller.browser.screenshot();
    const afterScreenshot = yield callbacks.onSaveScreenshot(
      afterScreenshotBuffer
    );
    const finishedAt = /* @__PURE__ */ new Date();
    const result = __spreadProps(__spreadValues({}, step), {
      startedAt,
      finishedAt,
      // placeholder values
      status: "SUCCESS" /* SUCCESS */,
      results: []
    });
    let message = "Successfully executed preset action.";
    if (step.command.type === "AI_ASSERTION" /* AI_ASSERTION */) {
      message = execResult.thoughts || "Assertion passed.";
    }
    const cmdMetadata = {
      beforeUrl,
      beforeScreenshot,
      afterUrl: controller.browser.url,
      afterScreenshot,
      startedAt,
      finishedAt,
      viewport: controller.browser.viewport,
      status: "SUCCESS" /* SUCCESS */
    };
    result.status = "SUCCESS" /* SUCCESS */;
    result.results = [cmdMetadata];
    result.message = message;
    (_b2 = callbacks.onSuccess) == null ? void 0 : _b2.call(callbacks, {
      message,
      startedAt: startedAt.getTime(),
      durationMs: finishedAt.getTime() - startedAt.getTime()
    });
    return result;
  } catch (err) {
    const finishedAt = /* @__PURE__ */ new Date();
    const result = __spreadProps(__spreadValues({}, step), {
      startedAt,
      finishedAt,
      status: "FAILED" /* FAILED */,
      message: `${err}`,
      results: [
        {
          beforeUrl,
          beforeScreenshot,
          afterUrl: controller.browser.url,
          afterScreenshot: void 0,
          startedAt,
          finishedAt,
          viewport: controller.browser.viewport,
          status: "FAILED" /* FAILED */,
          message: `${err}`
        }
      ]
    });
    (_c = callbacks.onFailure) == null ? void 0 : _c.call(callbacks, {
      message: `${err}`,
      startedAt: startedAt.getTime(),
      durationMs: finishedAt.getTime() - startedAt.getTime()
    });
    return result;
  }
});

// ../../packages/execute/src/steps/module.ts
var executeModuleStep = (_a) => __async(void 0, null, function* () {
  var _b = _a, {
    controller,
    step,
    advanced,
    logger
  } = _b, callbacks = __objRest(_b, [
    "controller",
    "step",
    "advanced",
    "logger"
  ]);
  var _a2, _b2, _c;
  (_a2 = callbacks.onStarted) == null ? void 0 : _a2.call(callbacks);
  const result = {
    type: "MODULE" /* MODULE */,
    moduleId: step.moduleId,
    startedAt: /* @__PURE__ */ new Date(),
    userAgent: ChromeBrowser.USER_AGENT,
    // placeholder values
    results: [],
    finishedAt: /* @__PURE__ */ new Date(),
    status: "SUCCESS" /* SUCCESS */
  };
  for (let i = 0; i < step.steps.length; i++) {
    const moduleStep = step.steps[i];
    logger.info({ i, moduleStep }, `Starting module step`);
    let moduleStepResult;
    switch (moduleStep.type) {
      case "PRESET_ACTION" /* PRESET_ACTION */:
        moduleStepResult = yield executePresetStep({
          controller,
          step: moduleStep,
          advanced,
          logger,
          onSaveScreenshot: callbacks.onSaveScreenshot,
          onStarted() {
            var _a3;
            (_a3 = callbacks.onStepStarted) == null ? void 0 : _a3.call(callbacks, { index: i });
          },
          onSuccess({ message, startedAt, durationMs }) {
            var _a3;
            (_a3 = callbacks.onStepSuccess) == null ? void 0 : _a3.call(callbacks, {
              index: i,
              message,
              startedAt,
              durationMs
            });
          },
          onFailure({ message, startedAt, durationMs }) {
            var _a3;
            (_a3 = callbacks.onStepFailure) == null ? void 0 : _a3.call(callbacks, {
              index: i,
              message,
              startedAt,
              durationMs
            });
          }
        });
        break;
      case "AI_ACTION" /* AI_ACTION */:
        moduleStepResult = yield executeAIStep({
          controller,
          step: moduleStep,
          advanced,
          logger,
          onSaveScreenshot: callbacks.onSaveScreenshot,
          onStarted() {
            var _a3;
            (_a3 = callbacks.onStepStarted) == null ? void 0 : _a3.call(callbacks, { index: i });
          },
          onSuccess({ message, startedAt, durationMs }) {
            var _a3;
            (_a3 = callbacks.onStepSuccess) == null ? void 0 : _a3.call(callbacks, {
              index: i,
              message,
              startedAt,
              durationMs
            });
          },
          onFailure({ message, startedAt, durationMs }) {
            var _a3;
            (_a3 = callbacks.onStepFailure) == null ? void 0 : _a3.call(callbacks, {
              index: i,
              message,
              startedAt,
              durationMs
            });
          },
          onCommandGenerated({ commandIndex, message }) {
            var _a3;
            (_a3 = callbacks.onCommandGenerated) == null ? void 0 : _a3.call(callbacks, { index: i, commandIndex, message });
          },
          onCommandExecuted({ commandIndex, message, command }) {
            var _a3;
            (_a3 = callbacks.onCommandExecuted) == null ? void 0 : _a3.call(callbacks, {
              index: i,
              commandIndex,
              message,
              command
            });
          }
        });
        break;
      default:
        const assertUnreachable = (_x) => {
          throw "If Typescript complains about the line below, you missed a case or break in the switch above";
        };
        return assertUnreachable(moduleStep);
    }
    result.results.push(moduleStepResult);
    if (moduleStepResult.status === "FAILED" /* FAILED */) {
      result.status = "FAILED" /* FAILED */;
      result.finishedAt = /* @__PURE__ */ new Date();
      for (let j = i + 1; j < step.steps.length; j++) {
        const skippedStep = step.steps[j];
        const skippedResult = __spreadProps(__spreadValues({}, skippedStep), {
          status: "CANCELLED" /* CANCELLED */,
          startedAt: /* @__PURE__ */ new Date(),
          finishedAt: /* @__PURE__ */ new Date(),
          userAgent: ChromeBrowser.USER_AGENT,
          results: [],
          message: "Cancelled due to previous failure."
        });
        result.results.push(skippedResult);
      }
      break;
    }
  }
  if (result.status === "SUCCESS" /* SUCCESS */) {
    (_b2 = callbacks.onSuccess) == null ? void 0 : _b2.call(callbacks, {
      message: "Executed module step.",
      startedAt: result.startedAt.getTime(),
      durationMs: result.finishedAt.getTime() - result.startedAt.getTime()
    });
  } else {
    (_c = callbacks.onFailure) == null ? void 0 : _c.call(callbacks, {
      message: "Failed to execute module step.",
      startedAt: result.startedAt.getTime(),
      durationMs: result.finishedAt.getTime() - result.startedAt.getTime()
    });
  }
  return result;
});

// ../../packages/execute/src/test.ts
var executeTest = (_0) => __async(void 0, [_0], function* ({
  test,
  runId,
  controller,
  logger,
  onUpdateRun,
  onSaveScreenshot
}) {
  const advanced = TestAdvancedSettingsSchema.parse(test.advanced);
  logger.info(`Starting run ${runId} for test ${test.id}`);
  yield onUpdateRun({
    status: "RUNNING",
    startedAt: /* @__PURE__ */ new Date()
  });
  let failed = false;
  const results = [];
  for (let i = 0; i < test.steps.length; i++) {
    const step = test.steps[i];
    let result;
    switch (step.type) {
      case "PRESET_ACTION" /* PRESET_ACTION */:
        result = yield executePresetStep({
          controller,
          step,
          advanced,
          logger,
          onSaveScreenshot
        });
        break;
      case "AI_ACTION" /* AI_ACTION */:
        result = yield executeAIStep({
          controller,
          step,
          advanced,
          logger,
          onSaveScreenshot
        });
        break;
      case "RESOLVED_MODULE":
        result = yield executeModuleStep({
          controller,
          step,
          advanced,
          logger,
          onSaveScreenshot
        });
        break;
      default:
        const assertUnreachable = (_x) => {
          throw "If Typescript complains about the line below, you missed a case or break in the switch above";
        };
        return assertUnreachable(step);
    }
    results.push(result);
    yield onUpdateRun({
      results
    });
    if (result.status === "FAILED" /* FAILED */) {
      failed = true;
      for (let j = i + 1; j < test.steps.length; j++) {
        const skippedStep = test.steps[j];
        if (skippedStep.type === "RESOLVED_MODULE") {
          const skippedResult = {
            type: "MODULE" /* MODULE */,
            moduleId: skippedStep.moduleId,
            startedAt: /* @__PURE__ */ new Date(),
            userAgent: ChromeBrowser.USER_AGENT,
            results: skippedStep.steps.map((s) => {
              return __spreadProps(__spreadValues({}, s), {
                status: "CANCELLED" /* CANCELLED */,
                startedAt: /* @__PURE__ */ new Date(),
                finishedAt: /* @__PURE__ */ new Date(),
                userAgent: ChromeBrowser.USER_AGENT,
                results: []
              });
            }),
            finishedAt: /* @__PURE__ */ new Date(),
            status: "CANCELLED" /* CANCELLED */
          };
          results.push(skippedResult);
        } else {
          const skippedResult = __spreadProps(__spreadValues({}, skippedStep), {
            status: "CANCELLED" /* CANCELLED */,
            startedAt: /* @__PURE__ */ new Date(),
            finishedAt: /* @__PURE__ */ new Date(),
            userAgent: ChromeBrowser.USER_AGENT,
            results: []
          });
          results.push(skippedResult);
        }
      }
    }
    if (failed) {
      break;
    }
  }
  yield onUpdateRun({
    status: failed ? "FAILED" : "PASSED",
    finishedAt: /* @__PURE__ */ new Date(),
    results
  });
  yield controller.browser.cleanup();
  return failed;
});

// src/logger.ts
var consoleLogger = {
  info: console.log,
  error: console.error,
  debug: console.debug,
  warn: console.warn,
  child: () => consoleLogger,
  flush: () => {
  }
};

// src/run-test.ts
function runTest(_0) {
  return __async(this, arguments, function* ({
    testId,
    apiClient,
    generator,
    newBaseURL
  }) {
    const test = yield apiClient.getTest(testId);
    const originalURL = new URL(test.baseUrl);
    const newURL = new URL(newBaseURL);
    originalURL.hostname = newURL.hostname;
    originalURL.protocol = newURL.protocol;
    originalURL.port = newURL.port;
    const browser = yield ChromeBrowser.init(
      originalURL.toString(),
      consoleLogger
    );
    const controller = new AgentController({
      browser,
      generator,
      config: DEFAULT_CONTROLLER_CONFIG,
      logger: consoleLogger
    });
    const run = yield apiClient.createRun({
      testId,
      trigger: "CLI"
    });
    let failed = true;
    try {
      failed = yield executeTest({
        test,
        runId: run.id,
        controller,
        logger: consoleLogger,
        onSaveScreenshot: (buffer) => __async(this, null, function* () {
          const { key } = yield apiClient.uploadScreenshot({
            screenshot: buffer.toString("base64")
          });
          return key;
        }),
        onUpdateRun: (data) => __async(this, null, function* () {
          yield apiClient.updateRun(run.id, data);
        })
      });
    } catch (err) {
      consoleLogger.error(err);
      yield apiClient.updateRun(run.id, {
        status: "FAILED",
        finishedAt: /* @__PURE__ */ new Date()
      });
    }
    return failed;
  });
}

// src/run-tests-locally.ts
function runTestsLocally(_0) {
  return __async(this, arguments, function* ({
    tests,
    start,
    waitOn,
    waitOnTimeout,
    server,
    apiKey
  }) {
    yield execCommand(start, false);
    yield waitOnFn({
      resources: [waitOn],
      timeout: waitOnTimeout * 1e3
    });
    const apiClient = new APIClient({
      baseURL: server,
      apiKey
    });
    const apiGenerator = new APIGenerator({
      baseURL: server,
      apiKey
    });
    const promises = tests.map((testId) => __async(this, null, function* () {
      let failed = true;
      try {
        failed = yield runTest({
          testId,
          apiClient,
          generator: apiGenerator,
          newBaseURL: waitOn
        });
      } catch (e) {
        console.error(e);
      }
      return { failed, testId };
    }));
    const results = yield Promise.all(promises);
    const failedResults = results.filter((result) => result.failed);
    if (failedResults.length > 0) {
      console.log(
        chalk.red(
          `Failed ${failedResults.length} out of ${results.length} tests:`
        )
      );
      failedResults.forEach((result) => {
        console.log(chalk.red(`- ${result.testId}`));
      });
      process.exit(1);
    }
    console.log(chalk.green(`All ${results.length} tests passed!`));
    process.exit(0);
  });
}
function execCommand(fullCommand, waitToFinish = true) {
  return __async(this, null, function* () {
    const args = parseArgsStringToArgv2(fullCommand);
    const toolPath = yield io.which(args[0], true);
    const toolArguments = args.slice(1);
    const promise = exec.exec(quote(toolPath), toolArguments);
    if (waitToFinish) {
      return promise;
    }
  });
}

// src/run-tests-remotely.ts
import chalk2 from "chalk";
function runTestsRemotely(_0) {
  return __async(this, arguments, function* ({
    tests,
    apiKey,
    server
  }) {
    const apiClient = new APIClient({
      baseURL: server,
      apiKey
    });
    yield apiClient.queueTests({
      testIds: tests
    });
    console.log(chalk2.green(`Successfully queued ${tests.length} tests!`));
  });
}

// src/cli.ts
var program = new Command4();
program.name("momentic").description("Momentic CLI").version(version);
program.command("install-browsers").action(() => __async(void 0, null, function* () {
  yield installBrowsers();
}));
program.command("run-tests").addOption(
  new Option(
    "--tests <tests...>",
    "specify tests to run"
  ).makeOptionMandatory(true)
).addOption(
  new Option("--api-key <key>", "API key for authenticating").env("MOMENTIC_API_KEY").makeOptionMandatory(true)
).addOption(
  new Option("--server <server>", "Momentic server to use").default(
    "https://api.momentic.ai"
  )
).addOption(
  new Option("--remote", "run tests remotely").default(true).conflicts(["start, waitOn, waitOnTimeout"]).implies({
    local: false
  })
).addOption(
  new Option("--local", "run tests locally").implies({
    start: "npm run start",
    waitOn: "http://localhost:3000",
    remote: false
  })
).addOption(new Option("--start <command>", "specify start command")).addOption(new Option("--wait-on <url>", "specify URL to wait on")).addOption(
  new Option(
    "--wait-on-timeout <timeout>",
    "specify how long to wait on url"
  ).default(60, "one minute")
).action((options) => __async(void 0, null, function* () {
  const {
    tests,
    apiKey,
    server,
    remote,
    local,
    start,
    waitOn,
    waitOnTimeout
  } = options;
  if (remote) {
    yield runTestsRemotely({ tests, apiKey, server });
    return;
  }
  if (local) {
    try {
      yield runTestsLocally({
        tests,
        start,
        waitOn,
        waitOnTimeout,
        server,
        apiKey
      });
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
    return;
  }
}));
function main() {
  return __async(this, null, function* () {
    yield program.parseAsync(process.argv);
  });
}
void main();
