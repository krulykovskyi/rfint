import { useMemo } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";

const uavDatabase = [
  {
    id: 1,
    name: "DJI Mavic 3",
    frequency: 2400,
    range: "900-1500",
    signalType: "ППРЧ",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
    description: "Профессиональный квадрокоптер для съемки",
    specs: "Время полета: 46 мин, Камера: 4K/120fps",
  },
  {
    id: 2,
    name: "Bayraktar TB2",
    frequency: 1200,
    range: "5000-15000",
    signalType: "ФРЧ",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=200&fit=crop",
    description: "Военный ударный БпЛА",
    specs: "Время полета: 27 ч, Дальность: 150 км",
  },
  {
    id: 3,
    name: "DJI Mini 2",
    frequency: 2400,
    range: "500-1000",
    signalType: "ППРЧ",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
    description: "Компактный дрон для начинающих",
    specs: "Время полета: 31 мин, Вес: 249г",
  },
  {
    id: 4,
    name: "Shahed-136",
    frequency: 900,
    range: "2000-3000",
    signalType: "ФРЧ",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=200&fit=crop",
    description: "Камикадзе дрон",
    specs: "Дальность: 2500 км, Боевая часть: 50 кг",
  },
  {
    id: 5,
    name: "Reaper MQ-9",
    frequency: 1800,
    range: "8000-12000",
    signalType: "ФРЧ",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=200&fit=crop",
    description: "Американский военный БпЛА",
    specs: "Время полета: 14 ч, Дальность: 1850 км",
  },
  {
    id: 6,
    name: "Phantom 4 Pro",
    frequency: 2400,
    range: "1000-1500",
    signalType: "ППРЧ",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop",
    description: "Профессиональный квадрокоптер",
    specs: "Время полета: 30 мин, Камера: 4K/60fps",
  },
];

export const FilterSearchBar = ({
  setSearchName,
  setFrequency,
  setRange,
  setSignalType,
  searchName,
  frequency,
  range,
  signalType,
}) => {
  const clearFilters = () => {
    setSearchName("");
    setFrequency("");
    setRange("");
    setSignalType("");
  };

  const parseRange = (rangeStr) => {
    if (!rangeStr) return null;
    const parts = rangeStr.split("-");
    if (parts.length !== 2) return null;
    const min = parseInt(parts[0]);
    const max = parseInt(parts[1]);
    return { min, max };
  };

  const filteredUAVs = useMemo(() => {
    return uavDatabase.filter((uav) => {
      // Фильтр по названию
      if (
        searchName &&
        !uav.name.toLowerCase().includes(searchName.toLowerCase())
      ) {
        return false;
      }

      // Фильтр по частоте
      if (frequency && uav.frequency !== parseInt(frequency)) {
        return false;
      }

      // Фильтр по диапазону
      if (range) {
        const inputRange = parseRange(range);
        const uavRange = parseRange(uav.range);
        if (!inputRange || !uavRange) return false;

        // Проверяем пересечение диапазонов
        const overlap = Math.max(
          0,
          Math.min(inputRange.max, uavRange.max) -
            Math.max(inputRange.min, uavRange.min)
        );
        if (overlap === 0) return false;
      }

      // Фильтр по типу сигнала
      if (signalType && uav.signalType !== signalType) {
        return false;
      }

      return true;
    });
  }, [searchName, frequency, range, signalType]);
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <SearchIcon color="primary" fontSize="large" />
        <Typography variant="h4" component="h1" color="primary">
          Поиск БпЛА по параметрам
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Назва БпЛА"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Введите название..."
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="ЦЧ (МГц)"
            type="number"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            placeholder="2400"
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Діапазон (м)"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            placeholder="1000-1500"
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Тип сигнала</InputLabel>
            <Select
              value={signalType}
              onChange={(e) => setSignalType(e.target.value)}
              label="Тип сигнала"
            >
              <MenuItem value="">
                <em>Выберите тип</em>
              </MenuItem>
              <MenuItem value="ФРЧ">ФРЧ</MenuItem>
              <MenuItem value="ППРЧ">ППРЧ</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={clearFilters}
          color="secondary"
        >
          Очистить фильтры
        </Button>
        <Typography variant="body1" color="text.secondary">
          Найдено результатов: {filteredUAVs.length}
        </Typography>
      </Box>
    </Paper>
  );
};
