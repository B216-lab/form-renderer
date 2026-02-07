#!/bin/sh
# Генерирует env.js из шаблона при старте контейнера
# Использует envsubst для подстановки переменных окружения

# Если VITE_API_BASE_URL не установлен, используем пустую строку (fallback к build-time значению)
export VITE_API_BASE_URL="${VITE_API_BASE_URL:-}"

# Генерируем env.js из шаблона
envsubst < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js

# Удаляем шаблон после генерации (опционально, для безопасности)
rm -f /usr/share/nginx/html/env.template.js
