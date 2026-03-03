@echo off
echo ========================================
echo   NETTOYAGE DU CACHE NEXT.JS
echo ========================================
echo.

echo [1/3] Suppression du dossier .next...
if exist .next (
    rmdir /s /q .next
    echo ✓ Cache .next supprime
) else (
    echo ✓ Pas de cache a supprimer
)
echo.

echo [2/3] Suppression du dossier node_modules/.cache...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo ✓ Cache node_modules supprime
) else (
    echo ✓ Pas de cache node_modules
)
echo.

echo [3/3] Nettoyage termine!
echo.
echo ========================================
echo   MAINTENANT, LANCEZ: npm run dev
echo ========================================
echo.
echo Puis dans le navigateur:
echo 1. Allez sur http://localhost:3000/client
echo 2. Appuyez sur Ctrl + Shift + R
echo.
pause
