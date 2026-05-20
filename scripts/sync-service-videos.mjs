/**
 * Đồng bộ video 3 gói dịch vụ từ E:\EDIT VIDEO\
 * Chạy: node scripts/sync-service-videos.mjs
 */
import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dest = join(root, "public", "videos", "services");
const base = "E:\\EDIT VIDEO";

const map = [
  ["AQO_7Pw2VXkQSoqK7kQZpjNVsDgiBAJRNUmjqZl8BvNAALEm0XyOCe2JPCAmhlL85iZWrpypA7renzoFsftg8sGGu83E5y9WlgXQmfudxgVcwe8vUYPMQrN53Ua4itRc.mp4", "don-dep-tong-the.mp4"],
  ["AQML4u-I7WHmjf4n31GYCYPyWT7elc1QF7957zwCycHV0Ua7AwS_CuLBCMoHqdtt5Mb-IuJjoC5LY6vcu3dYwB0Z42ntcNSOUrMA3Ww.mp4", "sap-xep-khong-gian.mp4"],
  ["AQOTEf9mF87Q_o2Eo_SyETEP9Jzmzw2ElbmJ05B5YaHvW_Cm4gVNJV8bpO2VcKe-bo42by3t4-rqgPbzho5HwRekNxzIjAnsHVK-TAuK23y_18C6zO1kZaz-OebQZQUp.mp4", "goi-dinh-ky-365.mp4"],
  ["AQOTEf9mF87Q_o2Eo_SyETEP9Jzmzw2ElbmJ05B5YaHvW_Cm4gVNJV8bpO2VcKe-bo42by3t4-rqgPbzho5HwRekNxzIjAnsHVK-TAuK23y_18C6zO1kZaz-OebQZQUp.mp4", "tong-ve-sinh-nha.mp4"],
  ["AQPyZLsgIQAbgxy1KS_966Tf8tsftfpjeF_mmV73nLXBDNm5OfetUXk4a7YEaHOSd2dlZkgFVYSsSWdxVaIPsCEDps4i8zHSEt5ums-t2y9vQd4gkmXXOxGICSCXPwE.mp4", "cham-soc-dinh-ky.mp4"],
  ["AQPlxQbSfvPwOLkg5hdAoPTF65yVCQAN7GCqd_OacbMPcuit5nl_Qv-HNlmbszV6brR1UOz92LR2hYbSGHwT_KbqS8cFRhnFKRrh4GVk7jPtdm9WzYDURi2oTn2PqMhd.mp4", "don-dep-van-phong.mp4"],
];

await mkdir(dest, { recursive: true });
for (const [srcName, outName] of map) {
  const from = join(base, srcName);
  const to = join(dest, outName);
  await copyFile(from, to);
  console.log(`→ ${outName}`);
}
