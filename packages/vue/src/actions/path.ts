export type MatchPath = ".." | "all" | RegExp

export function parsePath(path: string) {
  let startRoot = false
  let matches: MatchPath[] = []

  if (path.startsWith("~/")) {
    path = path.substring(2)
    startRoot = true
    matches.push(getReg(".*"))
  } else if (!path.startsWith("../")) {
    matches.push(getReg(".*"))
  }
  if (path.length === 0) return { matches: [], startRoot }

  path.split("/").forEach((p, i, arr) => {
    if (p === "..") {
      matches.push("..")
      matches.push(getReg(".*"))
      return
    }
    if (p === "all" && i === arr.length - 1) {
      matches.push("all")
      return
    }
    matches.push(getReg(p))
  })
  return { matches, startRoot }
}

const regCache = new Map<string, RegExp>([
  [".*", /.*/],
  ["", /\b/]
])

function getReg(p: string) {
  let r = regCache.get(p)
  if (!r) regCache.set(p, (r = new RegExp(p)))
  return r
}
