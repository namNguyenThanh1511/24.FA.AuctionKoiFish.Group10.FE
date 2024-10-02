function formatToVND(amount) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0, // No decimal places for VND
  });

  return formatter.format(amount);
}
export default formatToVND;
