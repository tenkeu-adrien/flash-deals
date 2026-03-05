@echo off
cls
echo.
echo ========================================
echo   FLASH DEALS - INSTALLATION COMPLETE
echo ========================================
echo.

echo [1/5] Installation de Firebase...
call npm install firebase
echo.

echo [2/5] Installation de Zustand...
call npm install zustand
echo.

echo [3/5] Nettoyage du cache...
if exist .next (
    rmdir /s /q .next
    echo ✓ Cache supprime
)
echo.

echo [4/5] Verification de .env.local...
if not exist .env.local (
    echo ⚠️ ATTENTION: .env.local n'existe pas!
    echo.
    echo Copiez .env.local.example en .env.local
    echo et ajoutez vos cles Firebase
    echo.
    pause
)
echo.

echo [5/5] Demarrage du serveur...
echo.
echo ========================================
echo   SERVEUR EN COURS DE DEMARRAGE...
echo ========================================
echo.
echo Une fois demarre:
echo.
echo 1. Allez sur: http://localhost:3000/seed
echo 2. Cliquez sur "Peupler la Base de Donnees"
echo 3. Allez sur: http://localhost:3000/client
echo 4. Vous verrez les donnees depuis Firebase!
echo.
echo ========================================
echo.

npm run dev
