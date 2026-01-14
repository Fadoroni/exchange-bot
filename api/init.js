// Валидация Telegram initData (без crypto — упрощённо для MVP)
function validate(initDataStr, botToken) {
  // Для MVP пропустим полную валидацию — но в продакшене её нужно добавить!
  return true;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { initData } = req.body;
  const params = new URLSearchParams(initData);
  const userStr = params.get('user');

  if (!userStr) {
    return res.status(400).json({ error: 'No user' });
  }

  let user;
  try {
    user = JSON.parse(userStr);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid user' });
  }

  // Получаем ADMIN_IDS из переменных окружения Vercel
  const ADMIN_IDS = (process.env.ADMIN_IDS || '').split(',').map(id => id.trim());
  const isAdmin = ADMIN_IDS.includes(String(user.id));

  const settings = {
    isHoliday: process.env.IS_HOLIDAY === 'true',
    operatorUsername: process.env.OPERATOR_USERNAME || 'exchange_vn_support',
    rates: {} // можно расширить
  };

  res.status(200).json({
    user: {
      id: user.id,
      first_name: user.first_name,
      photo_url: user.photo_url
    },
    isAdmin,
    settings
  });
}