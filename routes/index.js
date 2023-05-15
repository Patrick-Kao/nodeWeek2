var express = require('express');
var router = express.Router();
var path = require('path');
var XLSX = require('xlsx')
/* GET home page. */
router.get('/', function (req, res, next) {

  // 生成Excel文件
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet([
    { Name: "John", Age: 30 },
    { Name: "Jane", Age: 40 },
    { Name: "Bob", Age: 50 },
  ]);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  // // 儲存在本地方法
  const excelFilePath = "example.xlsx";
  console.log(path.join(__dirname, excelFilePath))
  XLSX.writeFile(workbook, path.join(__dirname, excelFilePath));
  res.setHeader("Content-Disposition", "attachment; filename=example.xlsx");
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  console.log(path.join(__dirname, excelFilePath))
  res.sendFile(path.join(__dirname, excelFilePath), (err) => {
    // 下載完成後刪除Excel文件
    // fs.unlinkSync(excelFilePath);
  });
});

module.exports = router;
