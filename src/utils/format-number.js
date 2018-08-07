export default (number, maxDecs = 6, locale = "en-US") =>
  new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: maxDecs
  })
    .format(number)
    .toLocaleString(locale);
