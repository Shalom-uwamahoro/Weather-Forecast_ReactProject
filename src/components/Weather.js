// src/components/Weather.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, CircularProgress, Grid, Box, Card, CardContent, CardMedia, Avatar } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import OpacityIcon from '@mui/icons-material/Opacity';
import AcUnitIcon from '@mui/icons-material/AcUnit';

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = process.env.REACT_APP_BASE_URL;

const Weather = () => {
  const { location } = useParams();
  const [currentWeather, setCurrentWeather] = useState(null);
  const [weeklyWeather, setWeeklyWeather] = useState([]);
  const [monthlyRainfall, setMonthlyRainfall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location) return;

    const fetchWeather = async () => {
      try {
        const currentResponse = await axios.get(`${BASE_URL}/current.json`, {
          params: {
            q: location,
            lang: 'en',
            key: API_KEY
          }
        });

        const forecastResponse = await axios.get(`${BASE_URL}/forecast.json`, {
          params: {
            q: location,
            days: 7,
            lang: 'en',
            key: API_KEY
          }
        });

        if (currentResponse.data) {
          setCurrentWeather(currentResponse.data);
        } else {
          throw new Error('Current weather data is unavailable');
        }

        if (forecastResponse.data && forecastResponse.data.forecast && forecastResponse.data.forecast.forecastday) {
          setWeeklyWeather(forecastResponse.data.forecast.forecastday);
          const rainfall = forecastResponse.data.forecast.forecastday.reduce((total, day) => total + day.day.totalprecip_mm, 0);
          setMonthlyRainfall(rainfall);
        } else {
          throw new Error('Forecast data is unavailable');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  if (!location) return <Typography>Enter a location to see the weather</Typography>;

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;
  if (!currentWeather) return <Typography>No data available for the specified location</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Weather in {currentWeather.location.name}, {currentWeather.location.country}</Typography>
      <Box>
        <Typography variant="h6">{currentWeather.current.condition.text}</Typography>
        <Typography variant="body1">Temperature: {currentWeather.current.temp_c}°C</Typography>
        <CardMedia
          component="img"
          image={currentWeather.current.condition.icon}
          alt={currentWeather.current.condition.text}
          style={{width: '200px', height: 'auto', margin: '0 auto'}}
        />
      </Box>

      <Typography variant="h5" gutterBottom style={{ marginTop: '40px' }}>Daily Weather Parameters</Typography>
      <Grid container spacing={3}>
        <Grid item xs={6} sm={3} display="flex" alignItems="center">
          <Avatar>
            <OpacityIcon />
          </Avatar>
          <Typography variant="body1" style={{ marginLeft: '10px' }}>Humidity: {currentWeather.current.humidity}%</Typography>
        </Grid>
        <Grid item xs={6} sm={3} display="flex" alignItems="center">
          <Avatar>
            <AcUnitIcon />
          </Avatar>
          <Typography variant="body1" style={{ marginLeft: '10px' }}>UV Index: {currentWeather.current.uv}</Typography>
        </Grid>
        {weeklyWeather.length > 0 && (
          <>
            <Grid item xs={6} sm={3} display="flex" alignItems="center">
              <Avatar>
                <WbSunnyIcon />
              </Avatar>
              <Typography variant="body1" style={{ marginLeft: '10px' }}>Sunrise: {weeklyWeather[0].astro.sunrise}</Typography>
            </Grid>
            <Grid item xs={6} sm={3} display="flex" alignItems="center">
              <Avatar>
                <Brightness2Icon />
              </Avatar>
              <Typography variant="body1" style={{ marginLeft: '10px' }}>Sunset: {weeklyWeather[0].astro.sunset}</Typography>
            </Grid>
          </>
        )}
      </Grid>

      {monthlyRainfall !== null && (
        <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>Monthly Rainfall: {monthlyRainfall} mm</Typography>
      )}

      <Typography variant="h5" gutterBottom style={{ marginTop: '40px' }}>Weekly Forecast</Typography>
      <Grid container spacing={2}>
        {weeklyWeather.map(day => (
          <Grid item xs={12} sm={6} md={3} lg={2} key={day.date}>
            <Card>
              <CardContent>
                <Typography variant="h6">{getDayName(day.date)}</Typography>
                <Typography variant="subtitle1">{day.date}</Typography>
                <Typography variant="body1">{day.day.condition.text}</Typography>
                <Typography variant="body2">Max: {day.day.maxtemp_c}°C</Typography>
                <Typography variant="body2">Min: {day.day.mintemp_c}°C</Typography>
                <CardMedia
                  component="img"
                  image={day.day.condition.icon}
                  alt={day.day.condition.text}
                  style={{width: '120px', height: 'auto', margin: '0 auto'}}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Weather;