const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// PostgreSQL 연결
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Render 환경변수로 설정
  ssl: { rejectUnauthorized: false }
});

app.use(cors());
app.use(bodyParser.json());

// POST 요청 처리
app.post('/check', async (req, res) => {
  const { name, phone, code } = req.body;

  try {
    const query = `
      SELECT * FROM users
      WHERE name = $1 AND phone = $2 AND code = $3
      LIMIT 1;
    `;
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
  console.log(`Server running at http://localhost:${port}`);
});
