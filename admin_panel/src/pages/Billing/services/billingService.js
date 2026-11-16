export function billDateTime(format) {
  return {
    date: format?.substring(0, 10),
    time: format?.substring(11, 16),
  };
}

export function billItemTotal(items) {
  var total = 0;
  items.filter(function (row) {
    total += row.price;
  });
  return total;
}
