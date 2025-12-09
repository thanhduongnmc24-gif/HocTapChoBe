const fs = require('fs');
const path = require('path');

// [SỬA LỖI Ở ĐÂY]
// Vì file này đang nằm trong thư mục ipa rồi, nên đường dẫn chỉ cần bắt đầu từ assets thôi
const imagesDir = path.join(__dirname, 'assets/game-images');
const outputFile = path.join(__dirname, 'app/math/imageList.ts');

console.log("📂 Đang tìm ảnh trong:", imagesDir);

try {
    // 1. Kiểm tra xem thư mục có tồn tại không
    if (!fs.existsSync(imagesDir)) {
        console.error("❌ Lỗi: Không tìm thấy thư mục 'assets/game-images'");
        console.error("👉 Anh nhớ tạo thư mục và bỏ ảnh vào đó trước nhé!");
        process.exit(1);
    }

    // 2. Đọc file
    const files = fs.readdirSync(imagesDir);
    
    // 3. Lọc lấy file ảnh
    const imageFiles = files.filter(file => 
        /\.(png|jpe?g|webp)$/i.test(file)
    );

    if (imageFiles.length === 0) {
        console.warn("⚠️ Cảnh báo: Thư mục này trống trơn, chưa có tấm ảnh nào cả!");
    }

    // 4. Tạo nội dung file code
    const fileContent = `// FILE TỰ ĐỘNG - ĐỪNG SỬA TAY
export const GAME_IMAGES = [
${imageFiles.map(file => `  require('../../assets/game-images/${file}'),`).join('\n')}
];
`;

    // 5. Ghi ra file
    fs.writeFileSync(outputFile, fileContent);
    
    console.log(`✅ Thành công! Đã tìm thấy ${imageFiles.length} ảnh.`);
    console.log(`✅ Đã tạo danh sách tại: ${outputFile}`);

} catch (err) {
    console.error("❌ Có lỗi xảy ra:", err.message);
}