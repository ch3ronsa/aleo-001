@echo off
title AleoDAO WSL Dagitim Araci (Final)
color 0A

echo ========================================================
echo       AleoDAO - WSL Dagitim Araci (Ubuntu)
echo ========================================================
echo.
echo Leo, Ubuntu kullanici profilinize yuklu.
echo Script simdi 'bash -l' (login shell) modunda calisacak.
echo.

echo [DEBUG] Leo versiyonu kontrol ediliyor...
wsl bash -l -c "leo --version"
if %errorlevel% neq 0 (
    echo [HATA] Leo hala bulunamadi.
    echo Lutfen Ubuntu terminalini acip 'leo --version' yazdiginizda calistigindan emin olun.
    pause
    exit /b
)
echo [OK] Leo basariyla tespit edildi!
echo.

:ASK_KEY
set /p PRIVATE_KEY="Lutfen Aleo Private Key'inizi yapistirin: "
if "%PRIVATE_KEY%"=="" goto ASK_KEY

echo.
echo [1/3] DAO Registry (Kayit Sistemi) dagitiliyor...
echo ----------------------------------------------------
wsl bash -l -c "cd '/mnt/c/Users/cheo/Desktop/leo/programs/dao_registry' && leo deploy --network testnet --endpoint https://api.explorer.aleo.org/v1 --private-key %PRIVATE_KEY%"
if %errorlevel% neq 0 (
    echo.
    echo [HATA] DAO Registry dagitilamadi.
    pause
) else (
    echo [BASARILI] DAO Registry yuklendi.
)

echo.
echo [2/3] Proposal (Teklif) Sistemi dagitiliyor...
echo ----------------------------------------------------
wsl bash -l -c "cd '/mnt/c/Users/cheo/Desktop/leo/programs/proposal' && leo deploy --network testnet --endpoint https://api.explorer.aleo.org/v1 --private-key %PRIVATE_KEY%"
if %errorlevel% neq 0 (
    echo.
    echo [HATA] Proposal sistemi dagitilamadi.
    pause
) else (
    echo [BASARILI] Proposal sistemi yuklendi.
)

echo.
echo [3/3] Private Vote (Gizli Oylama) dagitiliyor...
echo ----------------------------------------------------
wsl bash -l -c "cd '/mnt/c/Users/cheo/Desktop/leo/programs/private_vote' && leo deploy --network testnet --endpoint https://api.explorer.aleo.org/v1 --private-key %PRIVATE_KEY%"
if %errorlevel% neq 0 (
    echo.
    echo [HATA] Private Vote sistemi dagitilamadi.
    pause
) else (
    echo [BASARILI] Private Vote sistemi yuklendi.
)

echo.
echo ========================================================
echo ISLEM TAMAMLANDI.
echo ========================================================
echo.
pause
