#!/bin/bash

echo "========================================"
echo "  Pizza Palace - Local Development Start"
echo "========================================"
echo ""

# Start Backend in background
echo "Starting Backend Server..."
cd backend
npm run server > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend started (PID: $BACKEND_PID)"

# Wait for backend to start
sleep 3

# Start Frontend
echo ""
echo "Starting Frontend Server..."
cd ../frontend
npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
