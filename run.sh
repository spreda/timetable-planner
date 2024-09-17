if [ -d ".venv" ]; then
    python -m venv .venv
    pip install -r requirements.txt
fi
./.venv/Scripts/activate
cd server
uvicorn main:app --reload