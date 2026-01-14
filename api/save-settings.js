export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { initData, newSettings } = req.body;
  const params = new URLSearchParams(initData);
  const userStr = params.get('user');

  if (!userStr) return res.status(400).json({ error: 'No auth' });

  let user;
  try {
    user = JSON.parse(userStr);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid user' });
  }

  const ADMIN_IDS = (process.env.ADMIN_IDS || '').split(',').map(id => id.trim());
  if (!ADMIN_IDS.includes(String(user.id))) {
    return res.status(403).json({ error: 'Access denied' });
  }

  // В serverless-режиме мы НЕ можем сохранять в память.
  // Поэтому настройки будем хранить в переменных окружения Vercel.
  // Но так как их нельзя менять программно — для MVP просто имитируем сохранение.
  // В будущем можно подключить базу (Supabase, Firebase и т.д.)

  res.status(200).json({ success: true });
}