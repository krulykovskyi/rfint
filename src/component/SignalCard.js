import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Стилизованный компонент карточки
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 500,
  margin: theme.spacing(2),
  borderRadius: theme.spacing(2),
  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
}));

const SignalCard = ({
  name,
  maxHeight,
  workHeight,
  flightDuration,
  flightRange,
  cruisingSpeed,
  maxSpeed,
  description,
  signals,
  imageUrl,
}) => {
  return (
    <StyledCard>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={name}
          style={{
            width: "100%",
            height: 250,
            objectFit: "cover",
          }}
        />
      )}

      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {name}
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph>
          {description}
        </Typography>

        <Divider textAlign="left" sx={{ my: 2 }}>
          <Chip label="Характеристики польоту" />
        </Divider>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>Макс. висота:</strong> {maxHeight}
            </Typography>
            <Typography variant="body2">
              <strong>Робоча висота:</strong> {workHeight}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>Тривалість польоту:</strong> {flightDuration}
            </Typography>
            <Typography variant="body2">
              <strong>Дальність польоту:</strong> {flightRange}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>Крейсерська швидкість:</strong> {cruisingSpeed} км/год
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>Макс. швидкість:</strong> {maxSpeed} км/год
            </Typography>
          </Grid>
        </Grid>

        <Divider textAlign="left" sx={{ my: 2 }}>
          <Chip label="Канали зв'язку" />
        </Divider>

        {signals.map((signal, index) => (
          <Card
            key={index}
            variant="outlined"
            sx={{
              mb: 1,
              p: 1,
              backgroundColor: "rgba(0,0,0,0.05)",
            }}
          >
            <Typography variant="body2">
              <strong>Канал:</strong> {signal.channel}
            </Typography>
            <Typography variant="body2">
              <strong>Частота:</strong> {signal.frequency} МГц
            </Typography>
            <Typography variant="body2">
              <strong>Особливості:</strong> {signal.features}
            </Typography>
          </Card>
        ))}
      </CardContent>
    </StyledCard>
  );
};

export default SignalCard;

// Приклад використання
export const ExampleDroneSignalCard = () => (
  <SignalCard
    name="Лелека"
    maxHeight="1200 м"
    workHeight="600 м"
    flightDuration="3 год"
    flightRange="100 км"
    cruisingSpeed="60-70"
    maxSpeed="120"
    description="Український безпілотний літальний апарат, призначений для ведення розвідки. Електричний двигун. Створений українською компанією DeViRo."
    imageUrl="/path/to/leleka-image.jpg"
    signals={[
      {
        channel: "Канал телеметрії",
        frequency: "410-480",
        features:
          "Основний канал телеметрії, але при подавленні може передаватися по відеоканалу",
      },
      {
        channel: "Канал цільового навантаження",
        frequency: "2300, 900",
        features:
          "Ширина каналу ≈10МГц, при подавленні може змінювати частоту роботи",
      },
      {
        channel: "Канал управління",
        frequency: "438-448",
        features: "Діапазон роботи каналу при «взліт-посадка» ≈2.4ГГц",
      },
    ]}
  />
);
