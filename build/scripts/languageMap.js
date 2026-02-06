"use strict";
// This script is responsible for generating src/notion/languageMap.json
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.languages = void 0;
/* eslint-disable n/no-unpublished-import */
const l = __importStar(require("linguist-languages"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.languages = {
    abap: l.ABAP,
    arduino: undefined, // Handled as C++
    bash: l.Shell,
    basic: l.BASIC,
    c: l.C,
    clojure: l.Clojure,
    coffeescript: l.CoffeeScript,
    'c++': l['C++'],
    'c#': l['C#'],
    css: l.CSS,
    dart: l.Dart,
    diff: l.Diff,
    docker: l.Dockerfile,
    elixir: l.Elixir,
    elm: l.Elm,
    erlang: l.Erlang,
    flow: undefined, // Handled as JavaScript
    fortran: l.Fortran,
    'f#': l['F#'],
    gherkin: l.Gherkin,
    glsl: l.GLSL,
    go: l.Go,
    graphql: l.GraphQL,
    groovy: l.Groovy,
    haskell: l.Haskell,
    html: l.HTML,
    java: l.Java,
    javascript: l.JavaScript,
    json: l.JSON,
    julia: l.Julia,
    kotlin: l.Kotlin,
    latex: l.TeX,
    less: l.Less,
    lisp: l['Common Lisp'],
    livescript: l.LiveScript,
    lua: l.Lua,
    makefile: l.Makefile,
    markdown: l.Markdown,
    markup: undefined, // Handled as ?
    matlab: l.MATLAB,
    mermaid: undefined, // Handled as Markdown
    nix: l.Nix,
    'objective-c': l['Objective-C'],
    ocaml: l.OCaml,
    pascal: l.Pascal,
    perl: l.Perl,
    php: l.PHP,
    'plain text': undefined,
    powershell: l.PowerShell,
    prolog: l.Prolog,
    protobuf: l['Protocol Buffer'],
    python: l.Python,
    r: l.R,
    reason: l.Reason,
    ruby: l.Ruby,
    rust: l.Rust,
    sass: l.Sass,
    scala: l.Scala,
    scheme: l.Scheme,
    scss: l.SCSS,
    shell: l.Shell,
    sql: l.SQL,
    swift: l.Swift,
    typescript: l.TypeScript,
    'vb.net': l['Visual Basic .NET'],
    verilog: l.Verilog,
    vhdl: l.VHDL,
    'visual basic': undefined, // Handled as VB.Net
    webassembly: l.WebAssembly,
    xml: l.XML,
    yaml: l.YAML,
    'java/c/c++/c#': l.Java, // Other languages have their own tag
};
const map = {};
Object.entries(exports.languages).forEach(([notionKey, value]) => {
    [value].flat().filter(e => !!e).forEach(lang => {
        map[lang.aceMode] = notionKey;
        lang.aliases?.forEach(alias => {
            map[alias] = notionKey;
        });
    });
});
fs_1.default.writeFileSync(path_1.default.join(__dirname, '../src/notion/languageMap.json'), JSON.stringify(map, null, 2));
//# sourceMappingURL=languageMap.js.map