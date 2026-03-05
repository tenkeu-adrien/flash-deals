@echo off
chcp 65001 >nul
echo ╔════════════════════════════════════════════════════════════════╗
echo ║         VÉRIFICATION DE LA CONFIGURATION FIREBASE              ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

echo [1/5] Vérification du fichier .env.local...
if exist .env.local (
    echo ✅ Fichier .env.local trouvé
    echo.
    echo Contenu:
    echo ────────────────────────────────────────
    type .env.local
    echo ────────────────────────────────────────
) else (
    echo ❌ ERREUR: Fichier .env.local introuvable!
    echo.
    echo Solution: Le fichier a été créé, mais vous devez redémarrer le serveur
    goto :end
)

echo.
echo [2/5] Vérification des variables requises...
findstr /C:"NEXT_PUBLIC_FIREBASE_API_KEY" .env.local >nul
if %errorlevel%==0 (
    echo ✅ API_KEY présente
) else (
    echo ❌ API_KEY manquante
)

findstr /C:"NEXT_PUBLIC_FIREBASE_PROJECT_ID" .env.local >nul
if %errorlevel%==0 (
    echo ✅ PROJECT_ID présente
) else (
    echo ❌ PROJECT_ID manquante
)

findstr /C:"NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" .env.local >nul
if %errorlevel%==0 (
    echo ✅ STORAGE_BUCKET présente
) else (
    echo ❌ STORAGE_BUCKET manquante
)

echo.
echo [3/5] Vérification du format...
findstr /C:"\"" .env.local >nul
if %errorlevel%==0 (
    echo ⚠️  ATTENTION: Guillemets détectés dans .env.local
    echo    Les guillemets peuvent causer des problèmes
) else (
    echo ✅ Format correct (pas de guillemets)
)

echo.
echo [4/5] Vérification du fichier de configuration...
if exist lib\firebase\config.ts (
    echo ✅ Fichier config.ts trouvé
) else (
    echo ❌ Fichier config.ts introuvable
)

echo.
echo [5/5] Vérification du serveur...
tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I /N "node.exe">NUL
if %errorlevel%==0 (
    echo ✅ Serveur Node.js en cours d'exécution
    echo.
    echo ⚠️  IMPORTANT: Si vous venez de créer .env.local,
    echo    vous DEVEZ redémarrer le serveur pour que les
    echo    variables soient chargées!
    echo.
    echo    Utilisez: REDEMARRER_SERVEUR.bat
) else (
    echo ⚠️  Serveur Node.js non détecté
    echo    Lancez: npm run dev
)

echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo 📋 RÉSUMÉ:
echo.
echo Si tous les checks sont ✅, votre configuration est correcte!
echo.
echo 🚀 PROCHAINE ÉTAPE:
echo    1. Si le serveur tourne déjà: REDEMARRER_SERVEUR.bat
echo    2. Sinon: npm run dev
echo    3. Testez sur http://localhost:3000
echo.
echo ════════════════════════════════════════════════════════════════

:end
echo.
pause
