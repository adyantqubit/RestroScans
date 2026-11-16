import React from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import style from "../style/NewOrderReport.module.css";
import { useApp } from "../../../../Context/AppContext";
import { toExportRows } from "../../services/reportFilters";

const FILE_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const FILE_EXTENSION = ".xlsx";

export const ExportToExcel = ({ apiData, fileName }) => {
  const { Message } = useApp();

  const exportToExcel = () => {
    const rows = toExportRows(apiData);

    if (rows.length) {
      const sheet = XLSX.utils.json_to_sheet(rows);
      const workbook = { Sheets: { data: sheet }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: FILE_TYPE });
      FileSaver.saveAs(data, fileName + FILE_EXTENSION);
    } else {
      Message("No Data is Found", "warning");
    }
  };

  return (
    <button className={style.PrintBtn} onClick={exportToExcel}>
      Export
    </button>
  );
};

export default ExportToExcel;
