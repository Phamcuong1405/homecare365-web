const strings = [
  "Thời gian",
  "Họ và tên",
  "Số điện thoại",
  "Số nhà",
  "Ngõ/Hẻm",
  "Tên đường",
  "Phường/Xã",
  "Quận/Huyện",
  "Thành phố",
  "Nhu cầu dọn dẹp",
  "Địa chỉ đầy đủ",
  "Khách hàng",
  "Nhân viên HomeCare365",
  "Da sua tieu de cot tieng Viet",
  "Nguyễn Văn Test",
  "Ngõ 5",
  "Phố Huế",
  "Kim Liên",
  "Đống Đa",
  "Hà Nội",
  "Dọn 80m2, 1 lần/tuần",
];

function esc(s) {
  return [...s]
    .map((c) => {
      const n = c.charCodeAt(0);
      return n > 127 ? "\\u" + n.toString(16).padStart(4, "0") : c;
    })
    .join("");
}

for (const s of strings) {
  console.log(`"${esc(s)}", // ${s}`);
}
