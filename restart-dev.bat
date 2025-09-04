@echo off
echo 🔄 Nettoyage des processus Node.js...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo 🧹 Nettoyage du cache...
if exist node_modules\.vite rmdir /s /q node_modules\.vite
if exist dist rmdir /s /q dist

echo 🚀 Redémarrage du serveur de développement...
npm run dev