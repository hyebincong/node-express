const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// 데이터 파일 경로 설정
const dataFilePath = path.join(__dirname, 'data.json');

// 데이터 읽기 및 저장 함수
function readData() {
    if (fs.existsSync(dataFilePath)) {
        return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    }
    return { entries: [] };
}

function writeData(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// 서버가 시작할 때 데이터 읽기
const data = readData();

app.use(express.json());
app.use(express.static('public'));

// 일기 항목 추가
app.post('/api/entries', (req, res) => {
    const entry = req.body.entry;
    if (entry) {
        data.entries.push({ text: entry, comments: [] });
        writeData(data);
        res.status(201).json({ success: true });
    } else {
        res.status(400).json({ error: 'Entry is required' });
    }
});

// 댓글 추가
app.post('/api/comments', (req, res) => {
    const { entryIndex, comment } = req.body;
    if (typeof entryIndex === 'number' && comment) {
        if (data.entries[entryIndex]) {
            data.entries[entryIndex].comments.push(comment);
            writeData(data);
            res.status(201).json({ success: true });
        } else {
            res.status(400).json({ error: 'Invalid entry index' });
        }
    } else {
        res.status(400).json({ error: 'Entry index and comment are required' 
});
    }
});

// 일기 항목 삭제
app.delete('/api/entries/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    if (typeof index === 'number' && !isNaN(index)) {
        if (data.entries[index]) {
            data.entries.splice(index, 1);
            writeData(data);
            res.status(200).json({ success: true });
        } else {
            res.status(400).json({ error: 'Invalid entry index' });
        }
    } else {
        res.status(400).json({ error: 'Invalid index' });
    }
});

// 일기 항목과 댓글 가져오기
app.get('/api/entries', (req, res) => {
    res.json(data.entries);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// /healthz 라는 새로운 경로 추가
app.get('/healthz', (req, res) => {
  res.status(200).send('OK'); // 서버가 건강하면 OK라고 대답해요
});

