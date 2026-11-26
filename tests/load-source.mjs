import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
const testDirectory = path.dirname(fileURLToPath(import.meta.url))

// Load the actual TypeScript boundary with controlled services; no database or mail.
export function loadSource(relativePath, mocks = {}, globals = {}) {
  const filename = path.resolve(testDirectory, '..', relativePath)
  const nativeRequire = createRequire(filename)
  const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
    fileName: filename,
  }).outputText
  const mod = { exports: {} }
  const requireMock = (name) => {
    if (Object.hasOwn(mocks, name)) return mocks[name]
    if (name === 'server-only') return {}
    if (name === '@payload-config') return { default: {} }
    if (name.startsWith('@/components/')) return new Proxy({}, { get: (_, key) => String(key) })
    if (name.startsWith('@/')) return loadSource(`src/${name.slice(2)}.ts`, mocks, globals)
    return nativeRequire(name)
  }
  new Function('require', 'module', 'exports', ...Object.keys(globals), source)(
    requireMock, mod, mod.exports, ...Object.values(globals),
  )
  return mod.exports
}
