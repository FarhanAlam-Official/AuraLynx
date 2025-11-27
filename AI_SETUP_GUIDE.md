# 🎵 AuraLynx AI Music Generation Setup Guide

Get your AuraLynx application generating **fully AI-powered music** with:
- 🎵 **Unique Lyrics** (different every time!)
- 🎤 **AI Vocals** (realistic singing voices)
- 🎸 **AI Music** (instrumental tracks)

---

## 🎵 STEP 1: AI Lyrics Generation (REQUIRED)

### ✅ Groq API (FREE & FAST - RECOMMENDED)

**Why Groq?**
- Completely FREE (no credit card!)
- Very FAST (1-2 seconds)
- 14,400 requests/day
- Uses powerful Mixtral AI model

**Setup (30 seconds):**

1. Go to <https://console.groq.com>
2. Sign up with your email
3. Click "API Keys" → "Create New API Key"
4. Copy the key (starts with `gsk_...`)
5. Open `backend/.env` file
6. Add: `GROQ_API_KEY=gsk_your_actual_key_here`
7. Restart backend server

**That's it!** Now every song will have unique AI-generated lyrics! 🎉

---

## 🎤 STEP 2: AI Vocals (Optional but Recommended)

### ✅ ElevenLabs (FREE tier: 10k chars/month)

**Why ElevenLabs?**
- Best quality AI voice synthesis
- FREE tier: ~10-15 songs/month
- Realistic singing voices
- Multiple voice options

**Setup:**

1. Go to <https://elevenlabs.io/sign-up>
2. Sign up (FREE tier available)
3. Go to Profile → API Keys: <https://elevenlabs.io/api>
4. Copy your API key
5. Open `backend/.env` file
6. Add: `ELEVENLABS_API_KEY=your_key_here`
7. Restart backend server

**Optional: Choose different voice**
- Browse: <https://elevenlabs.io/voice-library>
- Copy voice ID
- Add to `.env`: `ELEVENLABS_VOICE_ID=voice_id_here`

---

## 🎸 STEP 3: AI Music Generation (Optional)

### Option A: Mubert API (FREE tier)

**Setup:**

1. Go to <https://mubert.com/render/api>
2. Sign up and request API access
3. Wait for approval (1-2 business days)
4. Get your API token
5. Add to `.env`: `MUBERT_API_KEY=your_token_here`
6. Restart backend server

### Option B: Keep Synthetic Audio

Current synthetic audio works without API keys. It creates genre-appropriate tracks but isn't AI-generated.

---

## 🚀 Quick Start Summary

**Minimum Setup (All FREE):**

```env
# Required for unique lyrics
GROQ_API_KEY=gsk_your_key_here

# Optional for AI vocals
ELEVENLABS_API_KEY=your_elevenlabs_key

# Optional for AI music
MUBERT_API_KEY=your_mubert_key
```

**With just Groq + ElevenLabs:**
- ✅ AI-generated unique lyrics
- ✅ AI-generated realistic vocals
- ⚠️  Synthetic instrumental (still works!)

---

## 🧪 Testing Your Setup

1. **Restart backend:** Ctrl+C, then run `python manage.py runserver`
2. **Generate a song** in the frontend
3. **Check backend terminal** for:

```
🤖 Using Groq API for lyrics generation...
✅ Successfully generated lyrics using Groq
🎤 Using ElevenLabs AI for vocal generation...
✅ Successfully generated vocals using ElevenLabs AI
🎵 Using Mubert API for instrumental generation...
✅ Successfully generated instrumental using Mubert API
```

---

## 💰 Pricing & Limits

| Service | Free Tier | Enough For | Paid Plans |
|---------|-----------|------------|------------|
| **Groq** | 14,400/day | Yes! | Currently free |
| **ElevenLabs** | 10k chars/month | ~15 songs | $5/mo for 30k |
| **Mubert** | Limited | Testing | Contact them |

**Recommendation:** Start with Groq (free forever) + ElevenLabs free tier

---

## 🔧 Troubleshooting

### ❌ "Creating template-based lyrics as fallback"
- Check: Did you add `GROQ_API_KEY` to `.env`?
- Check: No spaces around `=` sign
- Check: Restarted backend server?
- Check: Backend terminal for errors

### ❌ "Generating synthetic vocals (fallback)"
- This means ElevenLabs not configured
- Add `ELEVENLABS_API_KEY` to `.env`
- Synthetic vocals work but aren't realistic

### ❌ API Rate Limit Errors
- **Groq:** 30 requests/minute limit - wait 60 seconds
- **ElevenLabs:** Monthly limit - upgrade or wait for reset
- **Solution:** Cache generated songs (coming soon)

### ✅ Everything Working!
You should see:
- Different lyrics each time ✅
- Realistic AI vocals ✅
- No "fallback" messages ✅

---

## 📚 Additional Resources

- Groq Console: <https://console.groq.com>
- ElevenLabs Docs: <https://docs.elevenlabs.io>
- Mubert API: <https://mubert.com/render/api>
- Voice Library: <https://elevenlabs.io/voice-library>

---

## 🎯 Recommended Setup for Best Results

1. **Start with Groq** (5 minutes, completely free)
2. **Add ElevenLabs** (5 minutes, free tier available)
3. **Test your first AI song!** 🎵
4. **(Optional) Add Mubert later** for AI music

**Total setup time: ~10 minutes**
**Total cost: $0** (with free tiers)

Enjoy creating unique AI-generated music! 🎉
