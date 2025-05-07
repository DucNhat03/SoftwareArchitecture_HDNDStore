@echo off
echo Starting payment service (development mode) on Windows...

:: Set environment variables
set PORT=5003
set NGROK_AUTHTOKEN=2T8fQw9v3a6MnMzWmTeRP4WQ97q_5TyiMEBqHAcZeiD57k6Dv

:: Check if ngrok is in PATH
where ngrok >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Ngrok not found! Please install ngrok from https://ngrok.com/download
    echo After installation, add it to your PATH and run this script again.
    exit /b 1
)

:: Configure ngrok if authtoken is provided
if defined NGROK_AUTHTOKEN (
    ngrok config add-authtoken %NGROK_AUTHTOKEN%
)

:: Start ngrok in background
start "" ngrok http %PORT% --log=stdout

:: Wait for ngrok to start
echo Waiting for ngrok to start...
timeout /t 5 /nobreak >nul

:: Get the public URL from ngrok API
echo Getting ngrok public URL...
curl -s http://localhost:4040/api/tunnels > ngrok_output.json

:: Extract URL using findstr (Windows grep equivalent)
for /f "tokens=*" %%a in ('type ngrok_output.json ^| findstr "public_url" ^| findstr "https"') do (
    set FULL_LINE=%%a
)

:: Parse the URL from the JSON line
for /f "tokens=2 delims=:," %%a in ("%FULL_LINE%") do (
    set URL_WITH_QUOTES=%%a
)

:: Remove quotes
set NGROK_URL=%URL_WITH_QUOTES:"=%

if "%NGROK_URL%"=="" (
    echo Failed to get ngrok URL, using fallback
    echo http://localhost:%PORT%/callback > ngrok_url.txt
) else (
    echo Ngrok started successfully at %NGROK_URL%
    echo %NGROK_URL%/callback > ngrok_url.txt
)

:: Check if nodemon is installed
where nodemon >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Nodemon not found. Installing...
    npm install -g nodemon
)

:: Start Node.js app with nodemon
echo Starting Node.js application with nodemon...
nodemon server.js

:: Cleanup (this won't execute until nodemon is stopped)
del ngrok_output.json 