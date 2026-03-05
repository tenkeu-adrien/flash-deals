@echo off
cls
echo.
echo ========================================
echo   VERIFICATION COMPLETE DU PROJET
echo ========================================
echo.

echo [1/5] Verification de Node.js...
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ Node.js installe
    node --version
) else (
    echo ✗ Node.js non installe!
    pause
    exit /b 1
)
echo.

echo [2/5] Verification de npm...
npm --version >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ npm installe
    npm --version
) else (
    echo ✗ npm non installe!
    pause
    exit /b 1
)
echo.

echo [3/5] Verification des dependances...
if exist node_modules (
    echo ✓ node_modules existe
) else (
    echo ✗ node_modules manquant
    echo Installation des dependances...
    npm install
)
echo.

echo [4/5] Nettoyage du cache...
if exist .next (
    rmdir /s /q .next
    echo ✓ Cache .next supprime
) else (
    echo ✓ Pas de cache a supprimer
)
echo.

echo [5/5] Verification TypeScript...
echo Compilation TypeScript en cours...
npx tsc --noEmit >nul 2>&1
if %errorlevel% == 0 (
    echo ✓ Aucune erreur TypeScript
) else (
    echo ⚠ Erreurs TypeScript detectees
    echo Affichage des erreurs...
    npx tsc --noEmit
)
echo.

echo ========================================
echo   VERIFICATION TERMINEE
echo ========================================
echo.
echo Tout est pret! Lancez maintenant:
echo   npm run dev
echo.
echo Puis allez sur:
echo   http://localhost:3000/client
echo.
pause
