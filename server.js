const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL 연결
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(cors());
app.use(bodyParser.json());

// 👉 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// 👉 루트 경로에서 index.html 제공
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 👉 DB 조회 API
app.post('/check', async (req, res) => {
  const { name, phone, code } = req.body;

  try {
    const query = `SELECT * FROM users WHERE name = $1 AND phone = $2 AND code = $3 LIMIT 1`;
    const values = [name, phone, code];
    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: '정보가 일치하지 않습니다.' });
    }
  } catch (error) {
    console.error('DB 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
