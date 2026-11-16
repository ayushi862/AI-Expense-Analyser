# Wire into app.js / server.js
```js
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/rules', auth, require('./routes/ruleRoutes')); // auth = your existing middleware
```

.env additions:
```env
AI_MOCK=true
ANTHROPIC_API_KEY=sk-ant-...        # only needed when AI_MOCK=false
AI_MODEL=claude-3-5-haiku-latest   # optional (default: claude-3-5-haiku-latest)
```

Test:  AI_MOCK=true node scripts/testCategorization.js
Seed:  node seeds/categories.js
