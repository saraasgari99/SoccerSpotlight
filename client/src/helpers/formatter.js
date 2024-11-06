export function formatDuration(sec) {
  const date = new Date(0);
  date.setSeconds(sec ?? 0);
  return date.toISOString().substring(14, 19);
}

export function formatReleaseDate(date) {
  const dateObj = new Date(Date.parse(date));
  return dateObj.toLocaleString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function formatDate(newDate) {
  const months = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December',
  }
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const d = new Date(newDate)
  const year = d.getFullYear()
  const date = d.getDate()
  const monthIndex = d.getMonth()
  const monthName = months[d.getMonth()]
  const dayName = days[d.getDay()] // Thu
  const formatted = `${dayName}, ${date} ${monthName} ${year}`
  return formatted.toString()
}