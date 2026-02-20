import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import {
  OUTLINE_BORDER_THICK,
  OUTLINE_BORDER_THIN,
  BUTTON_RADIUS,
  CATEGORY_BAR_WIDTH,
} from "../../styles/tokens";
import { EXPENSE_CATEGORIES } from "./constant";
import type { Expense } from "../../types/expense";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../../services/expenses.service";

const TRIP_DATES = [
  { value: "2026-02-21", title: "2/21（六）" },
  { value: "2026-02-22", title: "2/22（日）" },
  { value: "2026-02-23", title: "2/23（一）" },
  { value: "2026-02-24", title: "2/24（二）" },
  { value: "2026-02-25", title: "2/25（三）" },
  { value: "2026-02-26", title: "2/26（四）" },
  { value: "2026-02-27", title: "2/27（五）" },
  { value: "2026-02-28", title: "2/28（六）" },
  { value: "2026-03-01", title: "3/1（日）" },
];

type Currency = "JPY" | "TWD" | "USD";

const CURRENCY_CONFIG: Record<
  Currency,
  { label: string; symbol: string; decimals: number }
> = {
  JPY: { label: "日圓 JPY", symbol: "¥", decimals: 0 },
  TWD: { label: "台幣 TWD", symbol: "NT$", decimals: 0 },
  USD: { label: "美元 USD", symbol: "$", decimals: 2 },
};

const getDateTitle = (dateValue: string) =>
  TRIP_DATES.find((d) => d.value === dateValue)?.title ?? dateValue;

export const ExpensesPage = () => {
  // 表單 state
  const [formExpanded, setFormExpanded] = useState(true);
  const [summaryExpanded, setSummaryExpanded] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  // 列表 state
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [filterDate, setFilterDate] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successSnackbar, setSuccessSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formErrors, setFormErrors] = useState({
    selectedDate: false,
    itemName: false,
    category: false,
    price: false,
  });

  // 編輯 state
  const [editingId, setEditingId] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // 刪除 state
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 匯率 state
  const [currency, setCurrency] = useState<Currency>("JPY");
  const [exchangeRates, setExchangeRates] = useState<{
    TWD: number;
    USD: number;
  } | null>(null);
  const [isLoadingRates, setIsLoadingRates] = useState(false);

  // 初始載入記帳記錄
  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const data = await getExpenses();
        setExpenses(data);
      } catch {
        setErrorMessage("載入記帳記錄失敗，請重新整理頁面");
      } finally {
        setIsLoadingList(false);
      }
    };
    loadExpenses();
  }, []);

  // 初始載入即時匯率
  useEffect(() => {
    const fetchRates = async () => {
      setIsLoadingRates(true);
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/JPY");
        const data = await res.json();
        setExchangeRates({
          TWD: data.rates.TWD,
          USD: data.rates.USD,
        });
      } catch {
        // 靜默失敗，保持 JPY 顯示
      } finally {
        setIsLoadingRates(false);
      }
    };
    fetchRates();
  }, []);

  // 金額轉換與格式化
  const convertAndFormat = (jpyAmount: number): string => {
    const config = CURRENCY_CONFIG[currency];
    let converted = jpyAmount;
    if (currency === "TWD" && exchangeRates) {
      converted = Math.round(jpyAmount * exchangeRates.TWD);
    } else if (currency === "USD" && exchangeRates) {
      converted = parseFloat(
        (jpyAmount * exchangeRates.USD).toFixed(config.decimals),
      );
    }
    return `${config.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals,
    })}`;
  };

  // 統計計算
  const totalAmount = expenses.reduce((sum, e) => sum + e.price, 0);
  const categoryTotals = EXPENSE_CATEGORIES.map((cat) => ({
    ...cat,
    total: expenses
      .filter((e) => e.category === cat.id)
      .reduce((sum, e) => sum + e.price, 0),
  })).filter((cat) => cat.total > 0);

  // 日期 filter 列表
  const expenseDates = [
    ...new Set(expenses.map((e) => e.purchase_date)),
  ].sort();
  const filteredExpenses = filterDate
    ? expenses.filter((e) => e.purchase_date === filterDate)
    : expenses;

  const validateForm = () => {
    const errors = {
      selectedDate: !selectedDate,
      itemName: !itemName.trim(),
      category: !category,
      price: !price || Number(price) <= 0,
    };
    setFormErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const newExpense = await createExpense({
        purchase_date: selectedDate,
        product_name: itemName.trim(),
        category,
        price: Number(price),
      });
      setExpenses((prev) => [newExpense, ...prev]);
      setSelectedDate("");
      setItemName("");
      setCategory("");
      setPrice("");
      setFormErrors({
        selectedDate: false,
        itemName: false,
        category: false,
        price: false,
      });
      setSuccessMessage("記帳新增成功！🐾");
      setSuccessSnackbar(true);
    } catch {
      setErrorMessage("新增記帳失敗，請稍後再試");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setSelectedDate("");
    setItemName("");
    setCategory("");
    setPrice("");
    setFormErrors({
      selectedDate: false,
      itemName: false,
      category: false,
      price: false,
    });
  };

  const handleEditClick = (expense: Expense) => {
    setEditingId(expense.id);
    setSelectedDate(expense.purchase_date);
    setItemName(expense.product_name);
    setCategory(expense.category);
    setPrice(String(expense.price));
    setFormErrors({
      selectedDate: false,
      itemName: false,
      category: false,
      price: false,
    });
    setFormExpanded(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    handleClear();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingExpense) return;
    setIsDeleting(true);
    setErrorMessage(null);
    try {
      await deleteExpense(deletingExpense.id);
      setExpenses((prev) => prev.filter((e) => e.id !== deletingExpense.id));
      if (editingId === deletingExpense.id) {
        setEditingId(null);
        handleClear();
      }
      setDeletingExpense(null);
    } catch {
      setErrorMessage("刪除記帳失敗，請稍後再試");
      setDeletingExpense(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async () => {
    if (!validateForm() || !editingId) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const updated = await updateExpense(editingId, {
        purchase_date: selectedDate,
        product_name: itemName.trim(),
        category,
        price: Number(price),
      });
      setExpenses((prev) =>
        prev.map((e) => (e.id === editingId ? updated : e)),
      );
      setEditingId(null);
      handleClear();
      setSuccessMessage("記帳修改成功！🐾");
      setSuccessSnackbar(true);
    } catch {
      setErrorMessage("修改記帳失敗，請稍後再試");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryInfo = (categoryId: string) =>
    EXPENSE_CATEGORIES.find((c) => c.id === categoryId);

  return (
    <>
      <Container maxWidth="md" sx={{ py: 3 }}>
        {/* 全域錯誤訊息 */}
        {errorMessage && (
          <Alert
            severity="error"
            onClose={() => setErrorMessage(null)}
            sx={{ mb: 2, borderRadius: 2 }}
          >
            {errorMessage}
          </Alert>
        )}

        {/* 統計總覽卡片 */}
        <Card
          sx={{
            mb: 3,
            border: OUTLINE_BORDER_THICK,
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: CATEGORY_BAR_WIDTH,
              backgroundColor: "#FFB830",
            },
          }}
        >
          <CardHeader
            title="花費總覽"
            avatar={<Typography variant="h5">💰</Typography>}
            action={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {/* 幣種切換 */}
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                    disabled={isLoadingRates}
                    sx={{
                      fontSize: "0.8rem",
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: OUTLINE_BORDER_THIN,
                      },
                    }}
                  >
                    {(Object.keys(CURRENCY_CONFIG) as Currency[]).map((key) => (
                      <MenuItem key={key} value={key}>
                        {isLoadingRates && key !== "JPY"
                          ? `${key} 載入中...`
                          : CURRENCY_CONFIG[key].label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <IconButton
                  onClick={() => setSummaryExpanded(!summaryExpanded)}
                >
                  <ExpandMoreIcon
                    sx={{
                      transform: summaryExpanded
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </IconButton>
              </Box>
            }
            sx={{ pb: 1 }}
          />
          <Collapse in={summaryExpanded} timeout={300}>
            <CardContent sx={{ pt: 0 }}>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 700, color: "secondary.main" }}
                >
                  {convertAndFormat(totalAmount)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  總花費
                  {currency !== "JPY" && exchangeRates && (
                    <> · 匯率來源：open.er-api.com</>
                  )}
                </Typography>
              </Box>

              {categoryTotals.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  尚未有任何記帳記錄
                </Alert>
              ) : (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {categoryTotals.map((cat) => (
                    <Chip
                      key={cat.id}
                      label={`${cat.emoji} ${cat.label} ${convertAndFormat(cat.total)}`}
                      sx={{
                        backgroundColor: `${cat.color}33`,
                        fontWeight: 600,
                        border: OUTLINE_BORDER_THIN,
                      }}
                    />
                  ))}
                </Box>
              )}
            </CardContent>
          </Collapse>
        </Card>

        {/* 新增 / 修改記帳表單 */}
        <Card
          ref={formRef}
          sx={{
            mb: 3,
            border: editingId ? "2.5px solid #FFB830" : OUTLINE_BORDER_THICK,
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: CATEGORY_BAR_WIDTH,
              backgroundColor: editingId ? "#FFB830" : "#3B7DD8",
            },
          }}
        >
          <CardHeader
            title={editingId ? "修改記帳" : "新增記帳"}
            avatar={
              <Typography variant="h5">{editingId ? "🖊️" : "✏️"}</Typography>
            }
            action={
              <IconButton onClick={() => setFormExpanded(!formExpanded)}>
                <ExpandMoreIcon
                  sx={{
                    transform: formExpanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                />
              </IconButton>
            }
            sx={{ pb: 1 }}
          />
          <Collapse in={formExpanded} timeout={300}>
            <CardContent sx={{ pt: 0 }}>
              {/* 購買日期選擇 */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                    color: formErrors.selectedDate ? "error.main" : "inherit",
                  }}
                >
                  購買日期{formErrors.selectedDate && " *必填"}
                </Typography>
                <ToggleButtonGroup
                  value={selectedDate}
                  exclusive
                  onChange={(_, value) => {
                    if (value) {
                      setSelectedDate(value);
                      setFormErrors((prev) => ({
                        ...prev,
                        selectedDate: false,
                      }));
                    }
                  }}
                  sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
                >
                  {TRIP_DATES.map((day) => (
                    <ToggleButton
                      key={day.value}
                      value={day.value}
                      sx={{
                        border: formErrors.selectedDate
                          ? "2px solid"
                          : OUTLINE_BORDER_THICK,
                        borderColor: formErrors.selectedDate
                          ? "error.main"
                          : undefined,
                        borderRadius: BUTTON_RADIUS / 2,
                        flex: "1 1 calc(33.33% - 8px)",
                        minWidth: 100,
                        fontWeight: 600,
                        "&.Mui-selected": {
                          backgroundColor: "primary.main",
                          color: "#fff",
                          "&:hover": { backgroundColor: "primary.dark" },
                        },
                      }}
                    >
                      {day.title}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>

              {/* 購買商品名 */}
              <TextField
                fullWidth
                label="購買商品名"
                placeholder="例：淺草寺御守"
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value);
                  setFormErrors((prev) => ({ ...prev, itemName: false }));
                }}
                error={formErrors.itemName}
                helperText={formErrors.itemName ? "請輸入商品名稱" : ""}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: BUTTON_RADIUS,
                    backgroundColor: "#fff",
                    "& fieldset": { border: OUTLINE_BORDER_THICK },
                    "&:hover": { backgroundColor: "#fff" },
                    "&.Mui-focused": { backgroundColor: "#fff" },
                  },
                }}
              />

              {/* 商品類別 */}
              <FormControl
                fullWidth
                error={formErrors.category}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: BUTTON_RADIUS,
                    backgroundColor: "#fff",
                    "& fieldset": { border: OUTLINE_BORDER_THICK },
                    "&:hover": { backgroundColor: "#fff" },
                    "&.Mui-focused": { backgroundColor: "#fff" },
                  },
                }}
              >
                <InputLabel>商品類別</InputLabel>
                <Select
                  value={category}
                  label="商品類別"
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setFormErrors((prev) => ({ ...prev, category: false }));
                  }}
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <span>{cat.emoji}</span>
                        <span>{cat.label}</span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.category && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, ml: 1.75 }}
                  >
                    請選擇商品類別
                  </Typography>
                )}
              </FormControl>

              {/* 價格（固定 JPY 輸入） */}
              <TextField
                fullWidth
                label="價格（日圓）"
                type="number"
                placeholder="0"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  setFormErrors((prev) => ({ ...prev, price: false }));
                }}
                error={formErrors.price}
                helperText={formErrors.price ? "請輸入大於 0 的金額" : ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">¥</InputAdornment>
                  ),
                }}
                inputProps={{ min: 0, step: 1, inputMode: "numeric" }}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: BUTTON_RADIUS,
                    backgroundColor: "#fff",
                    "& fieldset": { border: OUTLINE_BORDER_THICK },
                    "&:hover": { backgroundColor: "#fff" },
                    "&.Mui-focused": { backgroundColor: "#fff" },
                  },
                }}
              />
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2 }}>
              {editingId ? (
                <>
                  <Button
                    variant="contained"
                    color="warning"
                    startIcon={
                      isSubmitting ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <CheckIcon />
                      )
                    }
                    onClick={handleUpdate}
                    disabled={isSubmitting}
                    sx={{
                      minHeight: 40,
                      borderRadius: BUTTON_RADIUS,
                      border: OUTLINE_BORDER_THIN,
                      fontWeight: 700,
                    }}
                  >
                    {isSubmitting ? "修改中..." : "確認修改"}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CloseIcon />}
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                    sx={{
                      minHeight: 40,
                      borderRadius: BUTTON_RADIUS,
                      fontWeight: 600,
                    }}
                  >
                    取消修改
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={
                      isSubmitting ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <AddIcon />
                      )
                    }
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    sx={{
                      minHeight: 40,
                      borderRadius: BUTTON_RADIUS,
                      border: OUTLINE_BORDER_THIN,
                      fontWeight: 700,
                    }}
                  >
                    {isSubmitting ? "新增中..." : "新增記帳"}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleClear}
                    disabled={isSubmitting}
                    sx={{
                      minHeight: 40,
                      borderRadius: BUTTON_RADIUS,
                      fontWeight: 600,
                    }}
                  >
                    清空表單
                  </Button>
                </>
              )}
            </CardActions>
          </Collapse>
        </Card>

        {/* 記帳記錄列表 */}
        <Card
          sx={{
            mb: 3,
            border: OUTLINE_BORDER_THICK,
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: CATEGORY_BAR_WIDTH,
              backgroundColor: "#E8453C",
            },
          }}
        >
          <CardHeader
            title="記帳記錄"
            avatar={<Typography variant="h5">📋</Typography>}
            sx={{ pb: 1 }}
          />
          <CardContent sx={{ pt: 0 }}>
            {/* 載入中 */}
            {isLoadingList && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {[0, 1, 2].map((i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    height={56}
                    sx={{ borderRadius: 1 }}
                  />
                ))}
              </Box>
            )}

            {/* 空狀態 */}
            {!isLoadingList && expenses.length === 0 && (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  還沒有任何花費記錄喔！
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  快來新增你的第一筆記帳吧 🐾
                </Typography>
              </Box>
            )}

            {/* 有資料：日期 filter + 列表 */}
            {!isLoadingList && expenses.length > 0 && (
              <>
                {/* 日期 filter Chip */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  <Chip
                    label="全部"
                    onClick={() => setFilterDate("")}
                    variant={filterDate === "" ? "filled" : "outlined"}
                    sx={{
                      fontWeight: 600,
                      border: OUTLINE_BORDER_THIN,
                      ...(filterDate === "" && {
                        backgroundColor: "primary.main",
                        color: "#fff",
                        "&:hover": { backgroundColor: "primary.dark" },
                      }),
                    }}
                  />
                  {expenseDates.map((date) => (
                    <Chip
                      key={date}
                      label={getDateTitle(date)}
                      onClick={() => setFilterDate(date)}
                      variant={filterDate === date ? "filled" : "outlined"}
                      sx={{
                        fontWeight: 600,
                        border: OUTLINE_BORDER_THIN,
                        ...(filterDate === date && {
                          backgroundColor: "primary.main",
                          color: "#fff",
                          "&:hover": { backgroundColor: "primary.dark" },
                        }),
                      }}
                    />
                  ))}
                </Box>

                {/* 過濾後列表 */}
                {filteredExpenses.length === 0 ? (
                  <Box sx={{ textAlign: "center", py: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      此日期沒有任何記錄
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {filteredExpenses.map((expense) => {
                      const catInfo = getCategoryInfo(expense.category);
                      return (
                        <Box
                          key={expense.id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            p: 1.5,
                            borderRadius: 1,
                            border:
                              editingId === expense.id
                                ? "2px solid #FFB830"
                                : OUTLINE_BORDER_THIN,
                            backgroundColor:
                              editingId === expense.id
                                ? "#FFF8E1"
                                : "transparent",
                            position: "relative",
                            overflow: "hidden",
                            transition:
                              "background-color 0.2s, border-color 0.2s",
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: "4px",
                              backgroundColor: catInfo?.color ?? "#9E9E9E",
                            },
                            pl: 2.5,
                          }}
                        >
                          <Typography variant="h6" sx={{ lineHeight: 1 }}>
                            {catInfo?.emoji ?? "💴"}
                          </Typography>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                              noWrap
                            >
                              {expense.product_name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {getDateTitle(expense.purchase_date)} ·{" "}
                              {catInfo?.label ?? expense.category}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 700, whiteSpace: "nowrap" }}
                          >
                            {convertAndFormat(expense.price)}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleEditClick(expense)}
                            sx={{
                              color:
                                editingId === expense.id
                                  ? "#FFB830"
                                  : "text.secondary",
                              "&:hover": { color: "warning.main" },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => setDeletingExpense(expense)}
                            sx={{
                              color: "text.secondary",
                              "&:hover": { color: "error.main" },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* 刪除確認 Dialog */}
      <Dialog
        open={!!deletingExpense}
        onClose={() => !isDeleting && setDeletingExpense(null)}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>確認刪除？</DialogTitle>
        <DialogContent>
          <Typography variant="body2">確定要刪除這筆記帳記錄嗎？</Typography>
          {deletingExpense && (
            <Box
              sx={{
                mt: 1.5,
                p: 1.5,
                borderRadius: 1,
                backgroundColor: "#FFF3F3",
                border: "1px solid #E8453C33",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {getCategoryInfo(deletingExpense.category)?.emoji ?? "💴"}{" "}
                {deletingExpense.product_name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {getDateTitle(deletingExpense.purchase_date)} ·{" "}
                {getCategoryInfo(deletingExpense.category)?.label ??
                  deletingExpense.category}{" "}
                · {convertAndFormat(deletingExpense.price)}
              </Typography>
            </Box>
          )}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 1.5 }}
          >
            此操作無法復原。
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setDeletingExpense(null)}
            disabled={isDeleting}
            sx={{ borderRadius: BUTTON_RADIUS, fontWeight: 600 }}
          >
            取消
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={
              isDeleting ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <DeleteIcon />
              )
            }
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
            sx={{
              borderRadius: BUTTON_RADIUS,
              fontWeight: 700,
              border: OUTLINE_BORDER_THIN,
            }}
          >
            {isDeleting ? "刪除中..." : "確認刪除"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 成功 Snackbar */}
      <Snackbar
        open={successSnackbar}
        autoHideDuration={3000}
        onClose={() => setSuccessSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          onClose={() => setSuccessSnackbar(false)}
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ExpensesPage;
