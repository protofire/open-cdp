export default (number, maxDecs = 6) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: maxDecs
  }).format(number);
