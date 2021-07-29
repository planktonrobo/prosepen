export function removeHTMLTags(str) {
  return str.replace(/<[^>]*>?/gm, "");
}
export function getPTags(str) {
  const newS = str.match(/<\s*p[^>]*>([^<]*)<\s*\/\s*p\s*>/)
  return newS[1]}
export function shortenHTML(str){
  const maxLength = 100
  const trimmedString = str.substr(0, maxLength)
  return trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
}
export function handleDate(date) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const ugly = new Date(date["seconds"] * 1000);

  const modified = `${
    months[ugly.getMonth()]
  } ${ugly.getDate()}, ${ugly.getFullYear()} `;

  return modified;
}
