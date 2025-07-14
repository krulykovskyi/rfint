import { useState, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Chip,
  Divider,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import {
  Wifi as WifiIcon,
  Radio as RadioIcon,
  FlightTakeoff as FlightIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

import SignalCard from "./SignalCard";

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
    // Додаткові дані для SignalCard
    maxHeight: "6000 м",
    workHeight: "500 м",
    flightDuration: "46 хв",
    flightRange: "15 км",
    cruisingSpeed: 68,
    maxSpeed: 75,
    signals: [
      {
        channel: "Управління",
        frequency: 2400,
        features: "ППРЧ, шифрування",
      },
      {
        channel: "Відео",
        frequency: 5800,
        features: "HD передача, низька затримка",
      },
    ],
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
    maxHeight: "8230 м",
    workHeight: "5500 м",
    flightDuration: "27 год",
    flightRange: "150 км",
    cruisingSpeed: 130,
    maxSpeed: 222,
    signals: [
      {
        channel: "Командний канал",
        frequency: 1200,
        features: "Сателітний зв'язок, ФРЧ",
      },
      {
        channel: "Передача даних",
        frequency: 1800,
        features: "Високошвидкісна передача",
      },
    ],
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
    maxHeight: "4000 м",
    workHeight: "120 м",
    flightDuration: "31 хв",
    flightRange: "10 км",
    cruisingSpeed: 50,
    maxSpeed: 57,
    signals: [
      {
        channel: "Управління",
        frequency: 2400,
        features: "ППРЧ, автоматичне перемикання",
      },
    ],
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
    maxHeight: "4000 м",
    workHeight: "1000 м",
    flightDuration: "Одноразовий",
    flightRange: "2500 км",
    cruisingSpeed: 185,
    maxSpeed: 185,
    signals: [
      {
        channel: "Навігація",
        frequency: 900,
        features: "GPS/ГЛОНАСС, автономний режим",
      },
    ],
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
    maxHeight: "15240 м",
    workHeight: "7620 м",
    flightDuration: "14 год",
    flightRange: "1850 км",
    cruisingSpeed: 230,
    maxSpeed: 482,
    signals: [
      {
        channel: "Ku-band",
        frequency: 1800,
        features: "Сателітний зв'язок, шифрування",
      },
      {
        channel: "C-band",
        frequency: 4000,
        features: "Передача відео, телеметрія",
      },
    ],
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
    maxHeight: "6000 м",
    workHeight: "500 м",
    flightDuration: "30 хв",
    flightRange: "7 км",
    cruisingSpeed: 50,
    maxSpeed: 72,
    signals: [
      {
        channel: "LightBridge",
        frequency: 2400,
        features: "HD відео, низька затримка",
      },
      {
        channel: "Резервний",
        frequency: 5800,
        features: "Автоматичне перемикання",
      },
    ],
  },
];

export const GridBpLA = ({ searchName, frequency, range, signalType }) => {
  const [open, setOpen] = useState(false);
  const [selectedUAV, setSelectedUAV] = useState(null);

  const parseRange = (rangeStr) => {
    if (!rangeStr) return null;
    const parts = rangeStr.split("-");
    if (parts.length !== 2) return null;
    const min = parseInt(parts[0]);
    const max = parseInt(parts[1]);
    return { min, max };
  };

  const getSignalTypeColor = (type) => {
    return type === "ФРЧ" ? "error" : "primary";
  };

  const handleCardClick = (uav) => {
    setSelectedUAV(uav);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUAV(null);
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
    <>
      <Grid container spacing={3}>
        {filteredUAVs.map((uav) => (
          <Grid item xs={12} sm={6} md={4} key={uav.id}>
            <Card
              onClick={() => handleCardClick(uav)}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={uav.image}
                alt={uav.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {uav.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {uav.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    sx={{ mb: 1 }}
                  >
                    <WifiIcon color="primary" fontSize="small" />
                    <Typography variant="body2">
                      ЦЧ: {uav.frequency} МГц
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    sx={{ mb: 1 }}
                  >
                    <RadioIcon color="action" fontSize="small" />
                    <Typography variant="body2">
                      Діапазон: {uav.range} м
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    sx={{ mb: 1 }}
                  >
                    <FlightIcon color="action" fontSize="small" />
                    <Chip
                      label={uav.signalType}
                      color={getSignalTypeColor(uav.signalType)}
                      size="small"
                    />
                  </Box>
                </Box>

                <Divider sx={{ mb: 1 }} />
                <Typography variant="caption" color="text.secondary">
                  {uav.specs}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Popup Dialog з SignalCard */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: "90vh",
          },
        }}
      >
        <DialogActions sx={{ justifyContent: "flex-end", p: 1 }}>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogActions>

        <DialogContent sx={{ pt: 0, pb: 0 }}>
          {selectedUAV && (
            <SignalCard
              name={selectedUAV.name}
              maxHeight={selectedUAV.maxHeight}
              workHeight={selectedUAV.workHeight}
              flightDuration={selectedUAV.flightDuration}
              flightRange={selectedUAV.flightRange}
              cruisingSpeed={selectedUAV.cruisingSpeed}
              maxSpeed={selectedUAV.maxSpeed}
              description={selectedUAV.description}
              signals={selectedUAV.signals}
              imageUrl={selectedUAV.image}
              // Якщо потрібні функції пошуку
              setSearchName={() => {}}
              setFrequency={() => {}}
              setRange={() => {}}
              setSignalType={() => {}}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
