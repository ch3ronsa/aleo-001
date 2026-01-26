# Quick Start Guide

## 🚀 İlk Adımlar (5 dakika)

### 1. Frontend'i Çalıştır

```bash
# Frontend dizinine git
cd frontend

# Dependencies kur
npm install

# Development server başlat
npm run dev
```

Tarayıcıda http://localhost:3000 aç! 🎉

### 2. Leo Contracts'ı Build Et

```bash
# DAO Registry
cd programs/dao_registry
leo build

# Proposal
cd ../proposal
leo build

# Private Vote
cd ../private_vote
leo build
```

---

## 📝 Yapılacaklar - ÖNCELIK SIRASINA GÖRE

### ⚡ ZORUNLU (MUST DO)

1. **Frontend Test Et** (10 dakika)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   - Landing page açılmalı
   - Dashboard'a gidebilmelisin
   - DAO listesi görünmeli

2. **GitHub'a Push Et** (5 dakika)
   ```bash
   git init
   git add .
   git commit -m "AleoDAO - Privacy-Preserving DAO Governance"
   git remote add origin https://github.com/ch3ronsa/aleo-buildathon.git
   git push -u origin main
   ```

3. **README Güncelle** (5 dakika)
   - Team bilgilerini ekle
   - Discord handle ekle
   - Wallet address ekle

4. **Demo Video Kaydet** (20 dakika)
   - Landing page göster
   - Dashboard tour
   - Privacy features vurgula
   - 3-5 dakika yeter

---

### 🎯 ÖNERİLEN (SHOULD DO)

5. **Vercel Deploy** (10 dakika)
   ```bash
   cd frontend
   vercel
   ```

6. **Leo Install & Test** (15 dakika)
   ```bash
   # Leo kur
   curl -L https://raw.githubusercontent.com/AleoHQ/aleo/testnet3/install.sh | bash
   
   # Build et
   cd programs/dao_registry && leo build
   ```

---

### 🌟 BONUS (NICE TO HAVE)

7. **Testnet Deploy** (1 saat - OPSIYONEL!)
   ```bash
   leo account new
   leo deploy --network testnet
   ```

---

## 🆘 Sorun Giderme

### "npm install" hatası
```bash
# Node version kontrol (v18+ olmalı)
node --version

# Güncelle: https://nodejs.org/
```

### Port çakışması
```bash
# Farklı port kullan
npm run dev -- --port 3001
```

### Git push sorunu
```bash
# Credential ekle
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

---

## 📊 Minimum Viable Demo

**Frontend çalışıyor + GitHub'da kod var = SUBMIT EDEBİLİRSİN! ✅**

Testnet deploy opsiyonel - Mock data ile demo yapabilirsin.

---

## 📞 Yardım

Detaylı adımlar için: [action_plan.md](./action_plan.md) dosyasına bak!

**Start here**: `cd frontend && npm install && npm run dev` 🚀
