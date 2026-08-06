#!/bin/bash
while ! python3 -m pip --version > /dev/null 2>&1; do
    sleep 2
done
cd backend
python3 -m pip install -r requirements.txt --break-system-packages
python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000 > uvicorn.log 2>&1 &
