// === server.js ===
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// === НАСТРОЙКИ (временно в памяти) ===
let settings = {
  isHoliday: false,
  operatorUsername: 'exchange_vn_support',
  // Пример курсов для Нячанг
  rates: {
    'Нячанг_RUB_VND': { mode: 'manual', rate: 310, min: 5000, max: 500000 },
    'Нячанг_VND_RUB': { mode: 'manual', rate: 0.0032, min: 1000000, max: 100000000 },
    'Нячанг_USD_VND': { mode: 'manual', rate: 25000, min: 100, max: 10000 },
    'Нячанг_VND_USD': { mode: 'manual', rate: 0.00004, min: 1000000, max: 250000000 },
    'Нячанг_USDT_VND': { mode: 'manual', rate: 24800, min: 100, max: 10000 },
    'Нячанг_VND_USDT': { mode: 'manual', rate: 0.0000403, min: 1000000, max: 250000000 }
  }
};

// === Проверка админа (упрощённо для старта) ===
const ADMIN_IDS = (process.env.ADMIN_IDS || '').split(',').map(id => id.trim());

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Получить данные при запуске Web App
app.post('/api/init', (req, res) => {
  const initData = req.body.initData || '';
  const params = new URLSearchParams(initData);
  const userStr = params.get('user');
  
  if (!userStr) {
    return res.status(400).json({ error: 'No user data' });
  }

  let user;
  try {
    user = JSON.parse(userStr);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid user data' });
  }

  const isAdmin = ADMIN_IDS.includes(String(user.id));

  res.json({
    user: {
      id: user.id,
      first_name: user.first_name,
      photo_url: user.photo_url
    },
    isAdmin,
    settings
  });
});

// Сохранить настройки (админ)
app.post('/api/save-settings', (req, res) => {
  const initData = req.body.initData || '';
  const params = new URLSearchParams(initData);
  const userStr = params.get('user');
  
  if (!userStr) return res.status(400).json({ error: 'No auth' });

  let user;
  try {
    user = JSON.parse(userStr);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid user' });
  }

  if (!ADMIN_IDS.includes(String(user.id))) {
    return res.status(403).json({ error: 'Access denied' });
  }

  settings = req.body.newSettings;
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});