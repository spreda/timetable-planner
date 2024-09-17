if not exist .venv (
    python -m venv .venv 
    call ./.venv/Scripts/activate
    pip install -r requirements.txt
) else (
    call ./.venv/Scripts/activate
)
cd server
uvicorn main:app --reload