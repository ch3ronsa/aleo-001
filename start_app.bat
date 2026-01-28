@echo off
title AleoDAO Baslatiliyor...
color 0B

echo ========================================================
echo       AleoDAO - FRONTEND BASLATICI
echo ========================================================
echo.
echo Leo/Rust yuklu olmadigi icin "Demo Modu"nda calisacak.
echo Bu mod, video cekimi ve sunum icin gayet yeterlidir.
echo ZK kanitlari simule edilecek.
echo.
echo Uygulama baslatiliyor, lutfen bekleyin...
echo Tarayicidan http://localhost:3000 adresine gidin.
echo.

cd frontend
call npm run dev
pause
