#!/bin/bash
if [ ! -d ".venv" ]; then
    apt update
    apt install python3-virtualenv
    python -m venv .venv
    ./.venv/Scripts/activate
    pip install -r requirements.txt
else
    ./.venv/Scripts/activate
fi
cd app
uvicorn main:app --reload