import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import cpp from "highlight.js/lib/languages/cpp";
import fortran from "highlight.js/lib/languages/fortran";
import json from "highlight.js/lib/languages/json";
import python from "highlight.js/lib/languages/python";
import yaml from "highlight.js/lib/languages/yaml";
import { useMemo } from "react";

hljs.registerLanguage("python", python);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("json", json);
hljs.registerLanguage("yaml", yaml);
// Solver languages, for a course that starts from the learner's Fortran or C/C++ loops.
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("fortran", fortran);

/** A code block with syntax highlighting. Language from a hint (file name or fence tag), else guessed. */
export function Code({ text, lang, className }: { text: string; lang?: string; className?: string }) {
  const html = useMemo(() => {
    const l = !lang ? undefined : /\.py$|^py(thon)?$/.test(lang) ? "python" : /\.sh$|^(ba)?sh|shell|console$/.test(lang) ? "bash" : /\.json$|^json$/.test(lang) ? "json" : /\.ya?ml$|^ya?ml$/.test(lang) ? "yaml"
      : /\.(c|cc|cpp|cxx|cu|h|hpp)$|^(c|cpp|c\+\+|cuda)$/i.test(lang) ? "cpp" : /\.f(90|95|03|08)?$|^f(ortran|90)?$/i.test(lang) ? "fortran" : undefined;
    try {
      return l ? hljs.highlight(text, { language: l }).value : hljs.highlightAuto(text, ["python", "bash", "json"]).value;
    } catch { return null; }
  }, [text, lang]);
  return html != null
    ? <pre className={`hl ${className ?? ""}`} dangerouslySetInnerHTML={{ __html: html }} />
    : <pre className={`hl ${className ?? ""}`}>{text}</pre>;
}
