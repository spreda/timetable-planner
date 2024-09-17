if not exist .venv (
    sudo apt update
    sudo apt install python3-virtualenv
    python -m venv .venv 
    call ./.venv/Scripts/activate
    pip install -r requirements.txt
) else (
    call ./.venv/Scripts/activate
)
cd server
uvicorn app.main:app --reload