#!/bin/bash
if [ ! -d ".venv" ]; then
    python -m venv .venv
fi
if [ -d ".venv" ]; then
    ./.venv/Scripts/activate
fi
pip install -r requirements.txt
cd app
uvicorn main:app --reload