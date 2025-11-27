# 🎵 Quick API Keys Reference

## Current Status

Check your `.env` file and add the keys you want:

### For AI Lyrics (REQUIRED - choose one)

- [ ] **GROQ_API_KEY** - FREE, FAST ⭐ RECOMMENDED
  - Get at: <https://console.groq.com/keys>
  - Free: 14,400 requests/day
  
- [ ] OPENAI_API_KEY - Paid ($0.002 per request)
  - Get at: <https://platform.openai.com/api-keys>

- [ ] TOGETHER_API_KEY - Free tier available
  - Get at: <https://api.together.xyz/settings/api-keys>

### For AI Vocals (Optional)

- [ ] **ELEVENLABS_API_KEY** - FREE tier ⭐ RECOMMENDED
  - Get at: <https://elevenlabs.io/api>
  - Free: 10,000 characters/month (~15 songs)

- [ ] UBERDUCK_API_KEY + UBERDUCK_API_SECRET
  - Get at: <https://uberduck.ai>

### For AI Music (Optional)

- [ ] MUBERT_API_KEY - Free tier (requires approval)
  - Request at: <https://mubert.com/render/api>

---

## Minimal Setup (5 minutes, FREE)

Just add these two to your `.env` file:

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx
ELEVENLABS_API_KEY=xxxxxxxxxxxxxxxxxxxxxxx
```

This gives you:
✅ AI-generated unique lyrics
✅ AI-generated realistic vocals
⚠️ Synthetic instrumental (good enough!)

---

## What You Get Without Any API Keys

- ❌ Template-based lyrics (same patterns)
- ❌ Synthetic vocals (beep-boop sounds)
- ❌ Synthetic instrumental (basic tones)

**Not recommended for production!**

---

## After Adding Keys

1. Save `.env` file
2. Restart backend: `python manage.py runserver`
3. Generate a song
4. Check terminal for success messages ✅
