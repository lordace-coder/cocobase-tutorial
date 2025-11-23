# Troubleshooting Guide

Common issues and their solutions for the Cocopow project.

## Installation Issues

### "npm: command not found"

**Problem**: Node.js and npm are not installed.

**Solution**:
1. Download and install Node.js (v18+) from [nodejs.org](https://nodejs.org/)
2. Verify installation:
   ```bash
   node --version
   npm --version
   ```
3. Then run `npm install`

### "Cannot find module"

**Problem**: Dependencies not installed or corrupted.

**Solution**:
```bash
# Remove existing node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

### Permission errors during npm install

**Problem**: Insufficient permissions.

**Solution**:
```bash
# On Linux/Mac, don't use sudo with npm
# Instead, fix npm permissions:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# Then retry
npm install
```

## Build/Runtime Issues

### "Expected '>' but found 'value'" or similar JSX errors

**Problem**: JSX syntax in `.ts` file instead of `.tsx`.

**Solution**: This has been fixed - `useAuth.ts` was renamed to `useAuth.tsx`.

If you encounter similar issues:
- Rename any file with JSX from `.ts` to `.tsx`
- TypeScript automatically resolves imports

### Port 5173 already in use

**Problem**: Another process is using port 5173.

**Solution**:
- Vite will automatically use the next available port (5174, 5175, etc.)
- Or kill the process:
  ```bash
  # Linux/Mac
  lsof -ti:5173 | xargs kill -9

  # Windows
  netstat -ano | findstr :5173
  taskkill /PID <PID> /F
  ```

### "Module not found" errors in browser console

**Problem**: Incorrect import paths.

**Solution**:
- Check that all imports use correct relative paths
- Use `@/` prefix for absolute imports (configured in `vite.config.ts`)
- Restart the dev server after changing imports

### Styles not loading or appearing broken

**Problem**: CSS modules not being applied or cache issue.

**Solution**:
1. Hard refresh browser: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. Clear Vite cache and restart:
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```

## Google OAuth Issues

### Google OAuth button not appearing

**Problem**: Missing Google Client ID or incorrect configuration.

**Solution**:
1. Make sure `.env` file exists:
   ```bash
   cp .env.example .env
   ```

2. Add your Google Client ID to `.env`:
   ```
   VITE_GOOGLE_CLIENT_ID=your_actual_client_id
   ```

3. Restart dev server (required for env changes)

### "Invalid client ID" error

**Problem**: Client ID is incorrect or not configured in Google Cloud Console.

**Solution**:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to: APIs & Services → Credentials
4. Verify the Client ID matches your `.env` file
5. Check "Authorized JavaScript origins" includes:
   - `http://localhost:5173`
   - `http://localhost:5174` (if using alternate port)

### Google OAuth popup closes immediately

**Problem**: Authorized origins not configured.

**Solution**:
1. Go to Google Cloud Console → Credentials
2. Edit your OAuth 2.0 Client ID
3. Under "Authorized JavaScript origins", add:
   ```
   http://localhost:5173
   ```
4. Under "Authorized redirect URIs", add:
   ```
   http://localhost:5173
   ```
5. Save and wait a few minutes for changes to propagate

## Development Issues

### Changes not appearing in browser

**Problem**: Browser caching or HMR (Hot Module Replacement) not working.

**Solution**:
1. Hard refresh: `Ctrl+Shift+R` / `Cmd+Shift+R`
2. Check console for errors
3. Restart dev server
4. Clear browser cache completely

### TypeScript errors in editor but code runs fine

**Problem**: Editor TypeScript version differs from project version.

**Solution**:
- In VS Code: `Ctrl+Shift+P` → "TypeScript: Select TypeScript Version" → "Use Workspace Version"
- Restart editor

### ESLint errors

**Problem**: Code style doesn't match ESLint rules.

**Solution**:
```bash
# Auto-fix most issues
npm run lint -- --fix

# Or disable specific rules in .eslintrc.cjs if needed
```

## Build Issues

### Build fails with type errors

**Problem**: TypeScript strict mode catches errors.

**Solution**:
1. Fix all type errors shown in console
2. Common issues:
   - Missing type annotations
   - `any` types (use proper types)
   - Null/undefined handling

### Build succeeds but app doesn't work in production

**Problem**: Environment variables not set for production.

**Solution**:
1. Create `.env.production`:
   ```bash
   VITE_GOOGLE_CLIENT_ID=your_production_client_id
   VITE_API_URL=your_production_api_url
   ```

2. Update Google OAuth authorized origins for production domain

### Large bundle size

**Problem**: Bundle is too large.

**Solution**:
1. Check bundle analysis:
   ```bash
   npm run build
   ```

2. Optimize:
   - Lazy load routes with `React.lazy()`
   - Use code splitting
   - Optimize images
   - Remove unused dependencies

## Runtime Issues

### "Cannot read property of undefined" errors

**Problem**: Accessing data that hasn't loaded or doesn't exist.

**Solution**:
- Add null checks: `user?.name`
- Add loading states
- Use default values: `user ?? defaultUser`

### Images/videos not uploading

**Problem**: Mock implementation doesn't actually upload.

**Solution**:
- This is expected! The current code uses mock data
- Integrate with your BaaS storage service
- See `src/components/post/CreatePost.tsx` for integration points

### Likes/comments not persisting on refresh

**Problem**: Using in-memory state without database.

**Solution**:
- This is expected with mock data
- Integrate with your BaaS database
- See `src/components/feed/Feed.tsx` for integration points

## Mobile Issues

### Layout broken on mobile

**Problem**: Viewport not configured or CSS issues.

**Solution**:
1. Check `index.html` has viewport meta tag:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   ```

2. Test at different breakpoints:
   - 320px (small mobile)
   - 375px (iPhone)
   - 768px (tablet)
   - 1024px (desktop)

### Touch events not working

**Problem**: Click handlers instead of touch handlers.

**Solution**:
- The app uses `onClick` which works for both touch and click
- If issues persist, add `onTouchEnd` handlers

## Performance Issues

### Slow initial load

**Problem**: Large bundle or slow network.

**Solution**:
1. Run production build: `npm run build`
2. Test with: `npm run preview`
3. Optimize as needed:
   - Code splitting
   - Lazy loading
   - Image optimization

### App feels sluggish

**Problem**: Too many re-renders or heavy computations.

**Solution**:
1. Use React DevTools Profiler
2. Optimize with:
   - `React.memo()` for expensive components
   - `useMemo()` for expensive calculations
   - `useCallback()` for stable function references

## Getting Help

If you're still stuck:

1. **Check documentation**:
   - [README.md](README.md) - Full documentation
   - [COMPONENTS.md](COMPONENTS.md) - Component details
   - [QUICKSTART.md](QUICKSTART.md) - Quick start guide

2. **Check browser console**:
   - Open DevTools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed requests

3. **Check terminal**:
   - Look for build errors
   - Check for warnings

4. **Common fixes**:
   ```bash
   # Nuclear option - reset everything
   rm -rf node_modules package-lock.json .vite
   npm install
   npm run dev
   ```

## Debug Checklist

When something goes wrong:

- [ ] Check browser console for errors
- [ ] Check terminal for errors
- [ ] Try hard refresh (Ctrl+Shift+R)
- [ ] Verify `.env` file exists (if using Google OAuth)
- [ ] Restart dev server
- [ ] Clear Vite cache: `rm -rf node_modules/.vite`
- [ ] Reinstall dependencies
- [ ] Check Node.js version: `node --version` (should be v18+)
- [ ] Update to latest dependencies: `npm update`

---

**Still having issues?** The project structure is clean and well-organized. Most issues are related to environment setup rather than code issues.
