#!/bin/bash
DEBUG=true
if [ ! -d ".venv" ]; then
    python -m venv .venv
    ./.venv/Scripts/activate
    pip install -r requirements.txt
else
    ./.venv/Scripts/activate
fi
cd app
uvicorn app.main:app --reload