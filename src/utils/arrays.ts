export function shuffle<T>(items: Array<T>) {
  const count = items.length;
  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = items[i]
    items[i] = items[j]
    items[j] = temp
  }
}
