import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Fade,
  useTheme,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";
import TablePagination from "@mui/material/TablePagination";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useRef } from "react";

const mockData = [
  {
    id: 1019,
    date: "30 ก.ย., 21:20",
    status: "ชำระเงินแล้ว",
    customer: "สมฤดี",
    email: "sam@example.com",
    purchased: "Splashify 2.0",
    revenue: 49,
  },
  {
    id: 1018,
    date: "30 ก.ย., 19:15",
    status: "ชำระเงินแล้ว",
    customer: "เจสัน",
    email: "jason@example.com",
    purchased: "Splashify 2.0",
    revenue: 49,
  },
  {
    id: 1017,
    date: "29 ก.ย., 20:11",
    status: "ชำระเงินแล้ว",
    customer: "อีวา",
    email: "eva@example.com",
    purchased: "Splashify 2.0",
    revenue: 199,
  },
  {
    id: 101645,
    date: "28 ก.ย., 19:10",
    status: "ชำระเงินแล้ว",
    customer: "Citrus4eva",
    email: "citrus4eva@gmail.com",
    purchased: "Splashify 2.0",
    revenue: 49,
  },
  {
    id: 102316,
    date: "28 ก.ย., 19:10",
    status: "ชำระเงินแล้ว",
    customer: "Citrus4eva",
    email: "citrus4eva@gmail.com",
    purchased: "Splashify 2.0",
    revenue: 49,
  },
  {
    id: 145016,
    date: "28 ก.ย., 19:10",
    status: "ชำระเงินแล้ว",
    customer: "Citrus4eva",
    email: "citrus4eva@gmail.com",
    purchased: "Splashify 2.0",
    revenue: 49,
  },
  {
    id: 101236,
    date: "28 ก.ย., 19:10",
    status: "ชำระเงินแล้ว",
    customer: "Citrus4eva",
    email: "citrus4eva@gmail.com",
    purchased: "Splashify 2.0",
    revenue: 49,
  },
  {
    id: 1032116,
    date: "28 ก.ย., 19:10",
    status: "ชำระเงินแล้ว",
    customer: "Citrus4eva",
    email: "citrus4eva@gmail.com",
    purchased: "Splashify 2.0",
    revenue: 49,
  },
  {
    id: 1021316,
    date: "28 ก.ย., 19:10",
    status: "ชำระเงินแล้ว",
    customer: "Citrus4eva",
    email: "citrus4eva@gmail.com",
    purchased: "Splashify 2.0",
    revenue: 49,
  },
];

const FILTER_FIELDS = [
  { label: "เลขที่คำสั่งซื้อ", value: "id", type: "number" },
  { label: "วันที่", value: "date", type: "select" },
  { label: "สถานะ", value: "status", type: "select" },
  { label: "ลูกค้า", value: "customer", type: "select" },
  { label: "อีเมล", value: "email", type: "select" },
  { label: "สินค้า", value: "purchased", type: "select" },
  { label: "รายรับ", value: "revenue", type: "number" },
];

const FILTER_OPERATORS = {
  number: [
    { label: "เท่ากับ", value: "is" },
    { label: "มากกว่า", value: "gt" },
    { label: "น้อยกว่า", value: "lt" },
    { label: "ช่วงระหว่าง", value: "between" },
  ],
  text: [
    { label: "เท่ากับ", value: "is" },
    { label: "มีคำว่า", value: "contains" },
    { label: "ไม่เท่ากับ", value: "is_not" },
  ],
  select: [{ label: "เท่ากับ", value: "is" }],
};

function filterData(data, filters) {
  return data.filter((row) => {
    return filters.every((filter) => {
      const val = row[filter.field];
      if (filter.type === "number") {
        const num = Number(val);
        if (filter.operator === "is") return num === Number(filter.value);
        if (filter.operator === "gt") return num > Number(filter.value);
        if (filter.operator === "lt") return num < Number(filter.value);
        if (filter.operator === "between") {
          const [min, max] = filter.value.split(",").map(Number);
          return num >= min && num <= max;
        }
      }
      if (filter.type === "text" || filter.type === "select") {
        if (filter.operator === "is")
          return (val ?? "") === (filter.value ?? "");
        if (filter.operator === "contains")
          return (val ?? "")
            .toLowerCase()
            .includes((filter.value ?? "").toLowerCase());
        if (filter.operator === "is_not")
          return (val ?? "") !== (filter.value ?? "");
      }
      return true;
    });
  });
}

function sortData(data, sortConfig) {
  if (!sortConfig.key) return data;
  const sorted = [...data].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
    }
    // ลองแปลง date ถ้า field นั้นคือ date
    if (sortConfig.key === "date" && Date.parse(aVal) && Date.parse(bVal)) {
      return sortConfig.direction === "asc"
        ? Date.parse(aVal) - Date.parse(bVal)
        : Date.parse(bVal) - Date.parse(aVal);
    }
    // string
    return sortConfig.direction === "asc"
      ? String(aVal).localeCompare(String(bVal), "th")
      : String(bVal).localeCompare(String(aVal), "th");
  });
  return sorted;
}

function filterGlobal(data, term) {
  if (!term) return data;
  return data.filter((row) =>
    Object.values(row).join(" ").toLowerCase().includes(term.toLowerCase())
  );
}

const TableWithFilters = () => {
  const [globalDialogSearch, setGlobalDialogSearch] = useState("");

  const [filters, setFilters] = useState([]);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [newFilter, setNewFilter] = useState({
    field: "",
    operator: "",
    value: "",
    value2: "",
  });
  const [page, setPage] = useState(0);
  const rowsPerPage = 5; // ล็อกหน้าละ 5
  const DEFAULT_COL_WIDTH = 140;
  const initialColumnWidths = FILTER_FIELDS.reduce(
    (acc, col) => ({ ...acc, [col.value]: DEFAULT_COL_WIDTH }),
    {}
  );
  const [columnWidths, setColumnWidths] = useState(initialColumnWidths);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const dialogPaperRef = useRef(null); // <--- สร้าง ref

  const handleMouseDown = (colKey, e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = columnWidths[colKey];

    const handleMouseMove = (moveEvent) => {
      const newWidth = Math.max(80, startWidth + moveEvent.clientX - startX);
      setColumnWidths((prev) => ({
        ...prev,
        [colKey]: newWidth,
      }));
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const isSelected = (id) => selectedRows.includes(id);

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      isSelected(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // เลือกทุกแถว
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(mockData.map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const theme = useTheme();

  const getUniqueValues = (field) => {
    const set = new Set(mockData.map((row) => row[field]));
    return Array.from(set);
  };

  const sortedRows = sortData(mockData, sortConfig);

  const globalSearchFilter = filters.find((f) => f.type === "global");
  const filteredRows = filterGlobal(
    filterData(
      sortedRows, // << ตรงนี้
      filters.filter((f) => f.type !== "global")
    ),
    globalSearchFilter?.value || ""
  );
  const pagedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  function exportToCSV() {
    const columns = FILTER_FIELDS.map((col) => col.value);
    const header = FILTER_FIELDS.map((col) => `"${col.label}"`).join(",");
    const csv = [
      header,
      ...filteredRows.map((row) =>
        columns
          .map((col) =>
            typeof row[col] === "string"
              ? `"${row[col].replace(/"/g, '""')}"`
              : row[col]
          )
          .join(",")
      ),
    ].join("\r\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "table_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleSort = (colKey) => {
    setSortConfig((prev) => {
      if (prev.key === colKey) {
        if (prev.direction === "asc") return { key: colKey, direction: "desc" };
        if (prev.direction === "desc") return { key: null, direction: "asc" }; // clear sort
      }
      return { key: colKey, direction: "asc" };
    });
  };

  const handleOpenFilterDialog = () => {
    setNewFilter({ field: "", operator: "", value: "", value2: "" });
    setGlobalDialogSearch(""); // <- เพิ่มบรรทัดนี้
    setFilterDialogOpen(true);
  };

  const handleAddFilter = () => {
    if (globalDialogSearch) {
      // ลบ global filter เก่า ถ้ามี แล้วเพิ่มใหม่
      setFilters((prev) => [
        ...prev.filter((f) => f.type !== "global"),
        {
          type: "global",
          value: globalDialogSearch,
          label: "ค้นหาทั้งหมด",
          operatorLabel: "",
        },
      ]);
      setGlobalDialogSearch("");
      setFilterDialogOpen(false);
      return;
    }
    // logic เดิมสำหรับ filter column
    const col = FILTER_FIELDS.find((f) => f.value === newFilter.field);
    let value = newFilter.value;
    if (newFilter.operator === "between") {
      value = `${newFilter.value},${newFilter.value2}`;
    }
    setFilters([
      ...filters,
      {
        ...newFilter,
        type: col.type,
        value,
        label: col.label,
        operatorLabel: FILTER_OPERATORS[col.type]?.find(
          (op) => op.value === newFilter.operator
        )?.label,
      },
    ]);
    setFilterDialogOpen(false);
  };

  const handleRemoveFilter = (idx) => {
    setFilters(filters.filter((_, i) => i !== idx));
  };

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 4 },
        bgcolor: "#ede7f6",
        minHeight: "100vh",
        fontFamily: "'Noto Sans Thai', sans-serif",
        transition: "background 0.4s",
      }}
    >
      <Typography
        variant="h5"
        mb={2}
        sx={{
          fontFamily: "'Noto Sans Thai', sans-serif",
          color: "#573cc3",
          fontWeight: 600,
          letterSpacing: 0.5,
        }}
      >
        รายการสินทรัพย์จาก PO
      </Typography>
      <Box mb={2} display="flex" alignItems="center" gap={1} flexWrap="wrap">
        {filters.map((f, idx) => (
          <Chip
            key={idx}
            label={
              f.type === "global" ? (
                <span style={{ fontFamily: "'Noto Sans Thai', sans-serif" }}>
                  <b>ค้นหาทั้งหมด:</b>{" "}
                  <span style={{ color: "#5e35b1", fontWeight: 600 }}>
                    {f.value}
                  </span>
                </span>
              ) : (
                <span style={{ fontFamily: "'Noto Sans Thai', sans-serif" }}>
                  {`${f.label} ${f.operatorLabel} `}
                  <span
                    style={{
                      color: "#5e35b1",
                      fontWeight: 600,
                    }}
                  >
                    {f.operator === "between"
                      ? f.value.replace(",", " - ")
                      : f.value}
                  </span>
                </span>
              )
            }
            onDelete={() => handleRemoveFilter(idx)}
            sx={{
              bgcolor: "#ebe5fc",
              color: "#573cc3",
              fontWeight: 600,
              px: 1.5,
              py: 0.5,
              fontFamily: "'Noto Sans Thai', sans-serif",
              borderRadius: 2,
              fontSize: 16,
              transition: "background .2s, color .2s",
              "&:hover": {
                bgcolor: "#d1c4e9",
                color: "#311b92",
              },
            }}
            deleteIcon={
              <CloseIcon
                sx={{
                  color: "#7e57c2",
                  "&:hover": { color: "#d32f2f" },
                  transition: "color 0.2s",
                }}
              />
            }
          />
        ))}

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenFilterDialog}
          sx={{
            bgcolor: "#7e57c2",
            color: "#fff",
            fontFamily: "'Noto Sans Thai', sans-serif",
            borderRadius: 2,
            boxShadow: 2,
            px: 2.5,
            py: 1,
            fontWeight: 600,
            fontSize: 16,
            transition: "background .2s, box-shadow .2s",
            "&:hover": {
              bgcolor: "#5e35b1",
              boxShadow: 4,
            },
          }}
        >
          เพิ่มตัวกรอง
        </Button>
        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={exportToCSV}
          sx={{
            ml: 1,
            color: "#5e35b1",
            borderColor: "#7e57c2",
            fontFamily: "'Noto Sans Thai', sans-serif",
            fontWeight: 600,
            borderRadius: 2,
            px: 2.5,
            py: 1,
            fontSize: 16,
            "&:hover": {
              bgcolor: "#ede7f6",
              borderColor: "#5e35b1",
            },
          }}
        >
          ส่งออกเป็น CSV
        </Button>
      </Box>
      <Fade in>
        <Box
          sx={{
            width: "100%",
            // maxWidth: 900,
            mx: "auto",
            my: 3,
            bgcolor: "#f5f3fb",
            borderRadius: 4,
            boxShadow: "0 4px 18px #0002",
            overflow: "hidden",
          }}
        >
          {/* ตารางเป็นแนวนอน scroll ได้บนมือถือ */}
          <TableContainer
            sx={{
              overflowX: "auto",
              bgcolor: "#fff",
              borderTopLeftRadius: 3,
              borderTopRightRadius: 3,
              boxShadow: "0 8px 24px #573cc325, 0 1.5px 4px #573cc310",
              transition: "box-shadow .3s",
              "&:hover": {
                boxShadow: "0 12px 32px #573cc335, 0 3px 9px #573cc110",
              },
              width: "100%",
            }}
          >
            <Table
              sx={{
                minWidth: 650,
                fontFamily: "'Noto Sans Thai', sans-serif",
                tableLayout: "fixed",
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell
                    padding="checkbox"
                    sx={{
                      width: 48,
                      fontFamily: "'Noto Sans Thai', sans-serif",
                      fontWeight: 600,
                      color: "#573cc3",
                      bgcolor: "#f3ebfd",
                      fontSize: 15,
                      borderBottom: "2px solid #ede7f6",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <Checkbox
                      indeterminate={
                        selectedRows.length > 0 &&
                        selectedRows.length < mockData.length
                      }
                      checked={
                        mockData.length > 0 &&
                        selectedRows.length === mockData.length
                      }
                      onChange={handleSelectAll}
                      sx={{
                        color: "#7e57c2",
                        "&.Mui-checked": { color: "#5e35b1" },
                      }}
                    />
                  </TableCell>
                  {FILTER_FIELDS.map((col) => (
                    <TableCell
                      key={col.value}
                      sx={{
                        fontFamily: "'Noto Sans Thai', sans-serif",
                        fontWeight: 600,
                        color: "#573cc3",
                        bgcolor: "#f3ebfd",
                        fontSize: 15,
                        borderBottom: "2px solid #ede7f6",
                        width: columnWidths[col.value],
                        minWidth: 80,
                        maxWidth: 400,
                        position: "relative",
                        userSelect: "none",
                        transition: "width .15s",
                        borderRight: "1px solid #eee",
                        cursor: "pointer", // เพิ่ม pointer
                      }}
                      onClick={() => handleSort(col.value)}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                          position: "relative",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", mr: 1 }}
                        >
                          <span style={{ flex: 1 }}>{col.label}</span>
                          {sortConfig.key === col.value &&
                            (sortConfig.direction === "asc" ? (
                              <ArrowDropUpIcon
                                fontSize="small"
                                sx={{ color: "#7e57c2" }}
                              />
                            ) : (
                              <ArrowDropDownIcon
                                fontSize="small"
                                sx={{ color: "#7e57c2" }}
                              />
                            ))}
                        </Box>
                        {/* Resizer Handle */}
                        <DragIndicatorIcon
                          onMouseDown={(e) => handleMouseDown(col.value, e)}
                          sx={{
                            position: "absolute",
                            right: -6,
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "col-resize",
                            fontSize: 18,
                            color: "#bbb",
                            zIndex: 3,
                            transition:
                              "color .15s, background .2s, box-shadow .2s",
                            borderRadius: 1,
                            bgcolor: "transparent",
                            ":hover": {
                              color: "#5e35b1",
                              bgcolor: "#ede7f6",
                              boxShadow: "0 2px 8px #d1c4e980",
                            },
                            p: 0.2,
                          }}
                        />
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {pagedRows.length > 0 ? (
                  pagedRows.map((row, i) => (
                    <TableRow
                      key={row.id}
                      hover
                      selected={isSelected(row.id)}
                      sx={{
                        cursor: "pointer",
                        bgcolor: isSelected(row.id) ? "#ede7f6" : undefined,
                        "&:hover": { bgcolor: "#f3ebfd" },
                        fontFamily: "'Noto Sans Thai', sans-serif",
                      }}
                      onClick={() => handleSelectRow(row.id)}
                    >
                      <TableCell
                        padding="checkbox"
                        onClick={(e) => e.stopPropagation()}
                        sx={{ width: 48 }}
                      >
                        <Checkbox
                          checked={isSelected(row.id)}
                          onChange={() => handleSelectRow(row.id)}
                          sx={{
                            color: "#7e57c2",
                            "&.Mui-checked": { color: "#5e35b1" },
                          }}
                        />
                      </TableCell>
                      {FILTER_FIELDS.map((col) => (
                        <TableCell
                          key={col.value}
                          sx={{
                            fontFamily: "'Noto Sans Thai', sans-serif",
                            width: columnWidths[col.value],
                            minWidth: 80,
                            maxWidth: 400,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            // borderRight: "1px solid #eee",
                          }}
                        >
                          {col.value === "revenue"
                            ? `฿${row[col.value].toLocaleString()}`
                            : row[col.value]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={FILTER_FIELDS.length + 1}
                      align="center"
                      sx={{
                        color: "#aaa",
                        fontFamily: "'Noto Sans Thai', sans-serif",
                        fontSize: 18,
                        py: 4,
                      }}
                    >
                      ไม่พบข้อมูล
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination อยู่ล่างสุดแบบเต็ม width */}
          <Box sx={{ width: "100%", bgcolor: "#faf7fd" }}>
            <TablePagination
              component="div"
              count={mockData.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={() => {}}
              rowsPerPageOptions={[]} // ไม่แสดง dropdown
              labelDisplayedRows={({ from, to, count }) =>
                `แสดง ${from}-${to} จากทั้งหมด ${count} รายการ`
              }
              sx={{
                fontFamily: "'Noto Sans Thai', sans-serif",
                "& .MuiTablePagination-displayedRows": {
                  fontFamily: "'Noto Sans Thai', sans-serif",
                },
                "& .MuiTablePagination-selectLabel": {
                  fontFamily: "'Noto Sans Thai', sans-serif",
                },
                "& .MuiTablePagination-toolbar": {
                  bgcolor: "#faf7fd",
                },
                width: "100%",
                minWidth: 0,
              }}
            />
          </Box>
        </Box>
      </Fade>

      {/* Filter Dialog */}
      <Dialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        sx={{
          zIndex: 17000, // <<--- สูงกว่าทุกอย่าง (MUI default ประมาณ 1300-1600)
        }}
        PaperProps={{
          ref: dialogPaperRef, // <--- ใส่ ref ตรงนี้!

          sx: {
            borderRadius: 4,
            fontFamily: "'Noto Sans Thai', sans-serif",
            p: 1,
            bgcolor: "#faf7fd",
            boxShadow: "0 10px 40px #573cc320",
            zIndex: 17001, // <<--- Paper ควรสูงกว่าตัว Dialog
            position: "relative",
          },
        }}
        TransitionComponent={Fade}
        transitionDuration={350}
      >
        <DialogTitle
          sx={{
            fontFamily: "'Noto Sans Thai', sans-serif",
            fontWeight: 600,
            color: "#5e35b1",
            pb: 1.5,
            fontSize: 16,
            letterSpacing: 0.5,
            zIndex: 999999,
          }}
        >
          เพิ่มตัวกรอง
        </DialogTitle>
        <DialogContent
          sx={{
            minWidth: 340,
            fontFamily: "'Noto Sans Thai', sans-serif",
            py: 2,
          }}
        >
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              placeholder="ค้นหาทั้งหมด..."
              value={globalDialogSearch}
              onChange={(e) => setGlobalDialogSearch(e.target.value)}
              fullWidth
              autoFocus
              sx={{
                mb: 2,
                fontFamily: "'Noto Sans Thai', sans-serif",
                bgcolor: "#efe4fd",
                borderRadius: 2,
                maxWidth: 340,
              }}
              InputProps={{
                sx: { fontFamily: "'Noto Sans Thai', sans-serif" },
                // แก้ฟอนต์ของ placeholder
                inputProps: {
                  style: {
                    fontFamily: "'Noto Sans Thai', sans-serif",
                  },
                },
              }}
            />

            <Select
              value={newFilter.field}
              onChange={(e) =>
                setNewFilter({
                  field: e.target.value,
                  operator: "",
                  value: "",
                  value2: "",
                })
              }
              MenuProps={{
                disablePortal: true,
                PaperProps: { sx: { zIndex: 9999999 } }, // menu สูงกว่าตัว dialog
              }}
              displayEmpty
              fullWidth
              sx={{
                fontFamily: "'Noto Sans Thai', sans-serif",
                borderRadius: 2,
                bgcolor: "#f3ebfd",
                zIndex: 9999999, // <<--- Paper ควรสูงกว่าตัว Dialog
              }}
            >
              <MenuItem
                value=""
                disabled
                sx={{ fontFamily: "'Noto Sans Thai', sans-serif" }}
              >
                เลือกคอลัมน์
              </MenuItem>
              {FILTER_FIELDS.map((col) => (
                <MenuItem
                  key={col.value}
                  value={col.value}
                  sx={{ fontFamily: "'Noto Sans Thai', sans-serif" }}
                >
                  {col.label}
                </MenuItem>
              ))}
            </Select>
            {!!newFilter.field && (
              <Select
                value={newFilter.operator}
                onChange={(e) =>
                  setNewFilter({
                    ...newFilter,
                    operator: e.target.value,
                    value: "",
                    value2: "",
                  })
                }
                MenuProps={{
                  disablePortal: true,
                  PaperProps: { sx: { zIndex: 9999999 } }, // menu สูงกว่าตัว dialog
                }}
                displayEmpty
                fullWidth
                sx={{
                  fontFamily: "'Noto Sans Thai', sans-serif",
                  borderRadius: 2,
                  bgcolor: "#f3ebfd",
                  zIndex: 9999999, // <<--- Paper ควรสูงกว่าตัว Dialog
                }}
              >
                <MenuItem
                  value=""
                  disabled
                  sx={{ fontFamily: "'Noto Sans Thai', sans-serif" }}
                >
                  เลือกเงื่อนไข
                </MenuItem>
                {FILTER_OPERATORS[
                  FILTER_FIELDS.find((f) => f.value === newFilter.field)?.type
                ].map((op) => (
                  <MenuItem
                    key={op.value}
                    value={op.value}
                    sx={{ fontFamily: "'Noto Sans Thai', sans-serif" }}
                  >
                    {op.label}
                  </MenuItem>
                ))}
              </Select>
            )}
            {/* Value input */}
            {!!newFilter.operator &&
              (() => {
                const col = FILTER_FIELDS.find(
                  (f) => f.value === newFilter.field
                );
                if (!col) return null;

                // dropdown สำหรับ select หรือ field ที่ unique
                if (
                  col.type === "select" ||
                  ["customer", "email", "purchased", "status", "date"].includes(
                    col.value
                  )
                ) {
                  const uniqueOptions = getUniqueValues(col.value);
                  return (
                    <Select
                      value={newFilter.value}
                      onChange={(e) =>
                        setNewFilter({ ...newFilter, value: e.target.value })
                      }
                      MenuProps={{
                        disablePortal: true,
                        PaperProps: { sx: { zIndex: 9999999 } }, // menu สูงกว่าตัว dialog
                      }}
                      fullWidth
                      sx={{
                        fontFamily: "'Noto Sans Thai', sans-serif",
                        borderRadius: 2,
                        bgcolor: "#ebe5fc",
                        zIndex: 9999999, // <<--- Paper ควรสูงกว่าตัว Dialog
                      }}
                    >
                      <MenuItem
                        value=""
                        disabled
                        sx={{ fontFamily: "'Noto Sans Thai', sans-serif" }}
                      >
                        เลือกค่า
                      </MenuItem>
                      {uniqueOptions.map((opt) => (
                        <MenuItem
                          key={opt}
                          value={opt}
                          sx={{ fontFamily: "'Noto Sans Thai', sans-serif" }}
                        >
                          {opt}
                        </MenuItem>
                      ))}
                    </Select>
                  );
                }
                // number
                if (col.type === "number") {
                  if (newFilter.operator === "between") {
                    return (
                      <Box display="flex" gap={1}>
                        <TextField
                          value={newFilter.value}
                          onChange={(e) =>
                            setNewFilter({
                              ...newFilter,
                              value: e.target.value,
                            })
                          }
                          placeholder="ค่าต่ำสุด"
                          type="number"
                          fullWidth
                          autoFocus
                          InputProps={{
                            sx: { fontFamily: "'Noto Sans Thai', sans-serif" },
                            // แก้ฟอนต์ของ placeholder
                            inputProps: {
                              style: {
                                fontFamily: "'Noto Sans Thai', sans-serif",
                              },
                            },
                          }}
                          sx={{
                            fontFamily: "'Noto Sans Thai', sans-serif",
                            borderRadius: 2,
                            bgcolor: "#f3ebfd",
                          }}
                        />
                        <TextField
                          value={newFilter.value2}
                          onChange={(e) =>
                            setNewFilter({
                              ...newFilter,
                              value2: e.target.value,
                            })
                          }
                          InputProps={{
                            sx: { fontFamily: "'Noto Sans Thai', sans-serif" },
                            // แก้ฟอนต์ของ placeholder
                            inputProps: {
                              style: {
                                fontFamily: "'Noto Sans Thai', sans-serif",
                              },
                            },
                          }}
                          placeholder="ค่าสูงสุด"
                          type="number"
                          fullWidth
                          sx={{
                            fontFamily: "'Noto Sans Thai', sans-serif",
                            borderRadius: 2,
                            bgcolor: "#f3ebfd",
                          }}
                        />
                      </Box>
                    );
                  } else {
                    return (
                      <TextField
                        value={newFilter.value}
                        onChange={(e) =>
                          setNewFilter({ ...newFilter, value: e.target.value })
                        }
                        InputProps={{
                          sx: { fontFamily: "'Noto Sans Thai', sans-serif" },
                          // แก้ฟอนต์ของ placeholder
                          inputProps: {
                            style: {
                              fontFamily: "'Noto Sans Thai', sans-serif",
                            },
                          },
                        }}
                        placeholder="กรอกตัวเลข"
                        type="number"
                        fullWidth
                        autoFocus
                        sx={{
                          fontFamily: "'Noto Sans Thai', sans-serif",
                          borderRadius: 2,
                          bgcolor: "#f3ebfd",
                        }}
                      />
                    );
                  }
                }
                // text
                return (
                  <TextField
                    value={newFilter.value}
                    onChange={(e) =>
                      setNewFilter({ ...newFilter, value: e.target.value })
                    }
                    placeholder="กรอกข้อความ"
                    fullWidth
                    autoFocus
                    InputProps={{
                      sx: { fontFamily: "'Noto Sans Thai', sans-serif" },
                      // แก้ฟอนต์ของ placeholder
                      inputProps: {
                        style: { fontFamily: "'Noto Sans Thai', sans-serif" },
                      },
                    }}
                    sx={{
                      fontFamily: "'Noto Sans Thai', sans-serif",
                      borderRadius: 2,
                      bgcolor: "#f3ebfd",
                    }}
                  />
                );
              })()}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{ fontFamily: "'Noto Sans Thai', sans-serif", gap: 1 }}
        >
          <Button
            onClick={() => setFilterDialogOpen(false)}
            sx={{
              fontFamily: "'Noto Sans Thai', sans-serif",
              color: "#7e57c2",
              bgcolor: "#ede7f6",
              fontWeight: 600,
              borderRadius: 2,
              px: 2,
              "&:hover": { bgcolor: "#d1c4e9" },
            }}
          >
            ยกเลิก
          </Button>
          <Button
            onClick={handleAddFilter}
            variant="contained"
            sx={{
              fontFamily: "'Noto Sans Thai', sans-serif",
              bgcolor: "#7e57c2",
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              transition: "background .2s",
              "&:hover": { bgcolor: "#5e35b1" },
            }}
            disabled={
              !(
                globalDialogSearch ||
                (newFilter.field &&
                  newFilter.operator &&
                  (newFilter.value || newFilter.operator === "between"))
              )
            }
          >
            ใช้ตัวกรอง
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TableWithFilters;
