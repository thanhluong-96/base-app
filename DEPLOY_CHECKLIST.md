# 🚀 Daily Poll App - Deploy & Test Checklist

## ✅ BƯỚC 1: Deploy lên Vercel

### 1.1. Push code lên GitHub (nếu chưa có)
```bash
cd base-app
git init
git add .
git commit -m "Initial commit: Daily Poll App"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 1.2. Deploy lên Vercel

**Option A: Deploy qua Vercel Dashboard**
1. Vào [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import GitHub repository
4. Configure:
   - Framework Preset: **Next.js**
   - Root Directory: `base-app`
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Click "Deploy"

**Option B: Deploy qua CLI**
```bash
cd base-app
npm install -g vercel
vercel login
vercel --prod
```

### 1.3. Lấy Production URL
Sau khi deploy xong, bạn sẽ có URL dạng:
```
https://your-app-name.vercel.app
```

---

## ✅ BƯỚC 2: Setup Environment Variables

### 2.1. Thêm Environment Variables trong Vercel Dashboard

Vào Vercel Project → Settings → Environment Variables, thêm:

```bash
NEXT_PUBLIC_PROJECT_NAME="Daily Poll"
NEXT_PUBLIC_ONCHAINKIT_API_KEY=placeholder_key_for_now  # Optional
NEXT_PUBLIC_URL=https://your-app-name.vercel.app
```

**Lưu ý:** 
- Thay `your-app-name.vercel.app` bằng URL thật của bạn
- `NEXT_PUBLIC_ONCHAINKIT_API_KEY` là optional (không cần cho app hiện tại)

### 2.2. Redeploy sau khi thêm env vars
Vercel sẽ tự động redeploy, hoặc:
```bash
vercel --prod
```

---

## ✅ BƯỚC 3: Verify Manifest File

### 3.1. Kiểm tra manifest accessible
Mở browser và truy cập:
```
https://your-app-name.vercel.app/.well-known/farcaster.json
```

Bạn sẽ thấy JSON response với manifest data.

### 3.2. Verify các fields
Kiểm tra các fields sau có đúng không:
- ✅ `miniapp.name`: "Daily Poll"
- ✅ `miniapp.homeUrl`: URL của bạn
- ✅ `miniapp.iconUrl`: URL icon
- ✅ `miniapp.splashImageUrl`: URL splash image

---

## ✅ BƯỚC 4: Sign Manifest (Account Association)

### 4.1. Tắt Deployment Protection (nếu có)
1. Vào Vercel Dashboard → Project Settings
2. Settings → Deployment Protection
3. Tắt "Vercel Authentication" (nếu đang bật)

### 4.2. Generate Account Association

**Option A: Base Build (Recommended)**
1. Vào [base.dev/preview?tab=account](https://base.dev/preview?tab=account)
2. Paste app URL: `https://your-app-name.vercel.app`
3. Click "Submit"
4. Click "Verify" và follow instructions
5. Copy `accountAssociation` object

**Option B: Farcaster Manifest Tool**
1. Vào [Farcaster Manifest Tool](https://farcaster.xyz/~/developers/mini-apps/manifest)
2. Paste domain: `your-app-name.vercel.app`
3. Click "Generate account association"
4. Sign với Farcaster wallet
5. Copy `accountAssociation` object

### 4.3. Update minikit.config.ts

Mở `base-app/minikit.config.ts` và update:

```typescript
export const minikitConfig = {
  accountAssociation: {
    header: "paste-header-here",
    payload: "paste-payload-here",
    signature: "paste-signature-here"
  },
  miniapp: {
    // ... existing config
  },
}
```

### 4.4. Deploy lại
```bash
git add .
git commit -m "Add account association"
git push
# Vercel sẽ tự động deploy
```

---

## ✅ BƯỚC 5: Test trong Base Build Preview

### 5.1. Preview App
1. Vào [base.dev/preview](https://base.dev/preview)
2. Paste app URL: `https://your-app-name.vercel.app`
3. Click "Preview"

### 5.2. Verify các tabs:

**Console Tab:**
- ✅ App loads successfully
- ✅ No console errors
- ✅ Launch button works

**Account Association Tab:**
- ✅ Header, Payload, Signature valid
- ✅ Domain matches
- ✅ All green checkmarks

**Metadata Tab:**
- ✅ All required fields present
- ✅ Images load correctly
- ✅ No missing fields

---

## ✅ BƯỚC 6: Test trong Base App

### 6.1. Post App URL
1. Mở Base App (mobile hoặc web)
2. Tạo một post với app URL:
   ```
   Check out Daily Poll app! 🗳️
   https://your-app-name.vercel.app
   ```
3. Post lên feed

### 6.2. Verify Embed
- ✅ Preview card hiển thị đúng
- ✅ Icon và image load
- ✅ Launch button visible

### 6.3. Test App Functionality
1. Click "Launch" button
2. Test các features:
   - ✅ App loads trong Base App
   - ✅ Poll question hiển thị
   - ✅ Vote buttons work
   - ✅ Authentication works
   - ✅ Vote saves successfully
   - ✅ Results display correctly
   - ✅ Share button works

---

## ✅ BƯỚC 7: Final Checklist

### 7.1. Pre-Production Checklist
- [ ] Manifest accessible tại `/.well-known/farcaster.json`
- [ ] Account association signed và valid
- [ ] All images load correctly (icon, splash, hero)
- [ ] Environment variables set trong Vercel
- [ ] App loads < 3 seconds
- [ ] No console errors
- [ ] Authentication works
- [ ] Voting works
- [ ] Share functionality works

### 7.2. Remove `noindex` (khi ready)
Trong `app/.well-known/farcaster.json/route.ts`, set:
```typescript
noindex: false,  // Thay vì true
```

Redeploy để app được index trong search.

---

## 🐛 Troubleshooting

### Manifest không accessible?
- Check Vercel deployment logs
- Verify route file exists: `app/.well-known/farcaster.json/route.ts`
- Check URL: phải là `/.well-known/farcaster.json` (không có trailing slash)

### Account Association fails?
- Verify domain matches exactly
- Check signature is valid
- Ensure manifest is accessible before signing

### App không load trong Base App?
- Check console errors
- Verify `setFrameReady()` được gọi
- Check authentication flow
- Verify all API endpoints work

### Images không load?
- Check URLs trong `minikit.config.ts`
- Verify images exist trong `/public` folder
- Check CORS settings

---

## 📚 Resources

- [Base Docs - Create Mini App](https://docs.base.org/mini-apps/quickstart/create-new-miniapp)
- [Base Build Preview](https://base.dev/preview)
- [Farcaster Manifest Tool](https://farcaster.xyz/~/developers/mini-apps/manifest)
- [Vercel Deployment](https://vercel.com/docs)

---

## 🎉 Done!

Sau khi hoàn thành tất cả các bước trên, app của bạn sẽ:
- ✅ Deploy và accessible trên Vercel
- ✅ Manifest signed và verified
- ✅ Test được trong Base App
- ✅ Ready để publish và share!

