@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
title Push do GitHub - ProjectBeyond

rem Przejdz do folderu, w ktorym lezy ten plik
cd /d "%~dp0"

rem Repozytorium docelowe (zmien tylko jesli zmienisz repo)
set "REPO_URL=https://github.com/Jacobss23/ProjectBeyond.git"
set "BRANCH=main"

echo ==============================================
echo  Push projektu do GitHub: %REPO_URL%
echo ==============================================
echo.

where git >nul 2>&1
if errorlevel 1 (
  echo [BLAD] Nie znaleziono git. Zainstaluj Git for Windows: https://git-scm.com/download/win
  pause
  exit /b 1
)

rem Jesli folder nie jest repozytorium, zainicjuj go
if not exist ".git" (
  echo [INFO] Brak repozytorium git - inicjalizuje.
  git init -b %BRANCH%
  if errorlevel 1 goto :fail
)

rem Ustaw origin (dodaj, jesli brak; popraw, jesli inny)
git remote get-url origin >nul 2>&1
if errorlevel 1 (
  git remote add origin %REPO_URL%
) else (
  git remote set-url origin %REPO_URL%
)
if errorlevel 1 goto :fail

rem Sprawdz, czy sa zmiany
git add -A
if errorlevel 1 goto :fail

git diff --cached --quiet
if not errorlevel 1 (
  echo [INFO] Brak nowych zmian do zapisania.
  goto :push
)

rem Komunikat commita: wpisany przez uzytkownika albo domyslny z data i godzina
set "MSG="
set /p "MSG=Opis zmian (Enter = domyslny): "
if "!MSG!"=="" (
  for /f "tokens=1-5 delims=/:. " %%a in ("%date% %time%") do set "STAMP=%%a-%%b-%%c %%d:%%e"
  set "MSG=Aktualizacja projektu !STAMP!"
)

git commit -m "!MSG!"
if errorlevel 1 (
  echo.
  echo [INFO] Commit nie powstal. Jesli to pierwszy raz, ustaw autora:
  echo        git config --global user.name "Twoje Imie"
  echo        git config --global user.email "twoj@email"
  goto :fail
)

:push
echo.
echo [INFO] Wysylam na origin/%BRANCH% ...
git push -u origin %BRANCH%
if errorlevel 1 goto :fail

echo.
echo [OK] Gotowe. Zmiany sa na GitHubie.
pause
exit /b 0

:fail
echo.
echo [BLAD] Cos poszlo nie tak. Sprawdz komunikaty powyzej.
pause
exit /b 1
