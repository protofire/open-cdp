export default number =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(number);
